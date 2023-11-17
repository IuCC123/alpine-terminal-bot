# Alpine Terminal Bot

**Note: Currently Linux-only; you can modify the code to adapt it for Windows. This bot was initially created for the Minecraft server kaboom.pw. If you intend to use it on a different server or in your own world, feel free to customize it according to your requirements.**

Run Alpine Linux commands through a Minecraft-protocol bot that communicates with an Alpine Linux Docker image.

## Usage

1. Ensure that Docker is installed on your system. If not, you can install it from [here](https://docs.docker.com/get-docker).
2. Pull the Alpine Linux Docker image with the command: `docker pull alpine`. You can find the image [here](https://hub.docker.com/_/alpine).
3. Clone the repository using the following command: `git clone https://github.com/IuCC123/alpine-terminal-bot`. Make sure you have Git installed on your system.
4. Install the required packages by running `npm i` in the cloned repository directory.
5. Run `node .` and wait for the bot's core setup. Once complete, execute `,rebuild`, followed by `,run <command>`. The bot should respond with the given command's output.

Feel free to use and modify this bot as needed. Contributions are welcome through pull requests. Good luck!

Need assistance? Reach out to me on Discord! Discord tag: `iucc.`

**MIT License** - This software is free to use for everyone. [Read more](https://en.wikipedia.org/wiki/MIT_License), and refer to the [LICENSE file](https://github.com/IuCC123/alpine-terminal-bot/blob/main/LICENSE) for details.
