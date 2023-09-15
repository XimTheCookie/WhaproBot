# WhaproBot
My small attempt at making a Discord Music Bot in Node.
Will get occasionally updated for new features and/or bugfixes, expecially since i use this myself.
Unfortunately it looks like it is not possible to make a Discord.JS bot to work with multi threading, planning this for a possible bot rewrite in another language in future.

# How to run
Locally:
1. Install Node.JS (Bot was made using version 16.), you are free to us NVM. (ffmpeg is also required to run this code).
2. Create your Discord Bot on https://discord.com/developers/applications (and invite it to your Discord server).
3. Download WhaproBot and extract the archive wherever you want.
4. Edit file src/configuration.json, you must add bot token and bot user id, otherwise it will not work.
5. Open the project folder in terminal and run "npm run build" to compile the project.
6. (Only once) run "npm run deploy-commands" to register bot's slash commands to Discord.
7. run "npm run start" to start bot.

Docker:
TBD

# Future updates
What i plan for the future of this bot:
1. BugFixes every time a bug is found.
2. Add a user playlist system for user to save their own playlist.
3. Allow the custom deployment of commands to disable/enable commands.
4. Possibility to use a remote location for servers dj role configuration file.
5. Create a Docker image of the bot.
