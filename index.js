const nmp = require("minecraft-protocol");
const ChatMessage = require("prismarine-chat")("1.20.1");
const vec3 = require("vec3");
var containerId = null;

const bot = nmp.createClient({
  host: "mcslot.eu",
  port: 25565,
  username: "alpine-test",
  version: false,
});

bot.command = function (command) {
  bot.write("chat_command", {
    command,
    timestamp: 0,
    salt: 0n,
    argumentSignatures: [],
    signedPreview: false,
    messageCount: 0,
    acknowledged: Buffer.alloc(3),
    previousMessages: [],
  });
};

bot.chat = function (message) {
  bot.write("chat_message", {
    message,
    timestamp: 0,
    salt: 0,
  });
};

bot.on("state", function (newState) {
  if (newState === "play") {
    setTimeout(function () {
      bot.command("tp -124212 123 24922");
      setTimeout(function () {
        bot.command(
          "fill -124222 120 24931 -124202 119 24911 minecraft:command_block replace"
        );
      }, 4000);
    }, 1000);
  }
});

bot.on("disconnect", function (reason) {
  console.log("Disconnected: ", reason);
  process.exit(0);
});

bot.on("end", function (reason) {
  console.log("Ended: ", reason);
  process.exit(0);
});

bot.on("packet", async (data, meta) => {
  if (meta.name === "player_chat") {
    var msg = new ChatMessage(JSON.parse(data.unsignedChatContent));
    console.log(msg.toAnsi());
    if (msg.toString().split(": ")[1].startsWith(",rebuild")) {
      sendMessage("&bRebuilding docker container... This can take a while");
      const { exec } = require("child_process");
      exec("sudo rm -rf /var/lib/docker/containers/*");
      exec("screen -d -m docker run -ti alpine /bin/ash", (error) => {
        if (error) {
          console.error(`error: ${error.message}`);
          return;
        }
        exec("docker ps -lq", (stdout) => {
          console.log(stdout);
          containerId = stdout.replaceAll("\n", "");
          sendMessage(
            "&bDocker container has been rebuilt, you can now use it again."
          );
        });
      });
    }
    if (msg.toString().split(": ")[1].startsWith(",run ")) {
      sendMessage("&bRunning command in Docker virtual environment...");
      const Docker = require("dockerode");
      const docker = new Docker();
      const command = (msg.toString().split(",run ")[1] = msg
        .toString()
        .split(",run ")[1]
        .replaceAll("rm", "")
        .replaceAll("reboot", "")
        .replaceAll("halt", "")
        .split(" "));

      docker.getContainer(containerId).exec(
        {
          cmd: command,
          attachStdout: true,
          attachStderr: true,
        },
        (err, exec) => {
          if (err) {
            console.error(err);
            return;
          }
          exec.start((err, stream) => {
            if (err) {
              console.error(err);
              return;
            }
            let output = "";
            stream.on("data", (chunk) => {
              output += chunk.toString("utf8");
            });
            stream.on("end", () => {
              exec.inspect((err) => {
                if (err) {
                  console.error(err);
                  return;
                }
                output
                  .toString()
                  .split("\n")
                  .forEach(function (line) {
                    runCmd('tellraw @a "§a' + line + '"');
                  });
              });
            });
          });
        }
      );
    }
  }
});

function sendMessage(message) {
  runCmd(`/bcraw ${message}`);
}

function runCmd(cmd) {
  commandsArray.push(cmd);
  checkArray();
}

function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var commandsArray = [];

function checkArray() {
  if (commandsArray.length > 0) {
    commandsArray.forEach(function (cmd, index) {
      setTimeout(function () {
        const minX = -124222;
        const maxX = -124202;
        const minY = 121;
        const maxY = 118;
        const minZ = 24911;
        const maxZ = 24931;

        const randomX = getRandomValue(minX, maxX);
        const randomY = getRandomValue(minY, maxY);
        const randomZ = getRandomValue(minZ, maxZ);
        bot.write("update_command_block", {
          location: vec3(randomX, randomY, randomZ),
          command: cmd,
          mode: 1,
          flags: 0b100,
        });
      });
      commandsArray = [];
    });
  }
}
