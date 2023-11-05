# WhaproBot
My small attempt at making a Discord Music Bot in Node and using Docker.
Will get occasionally updated for new features and/or bugfixes, expecially since i use this myself.
Unfortunately it looks like it is not possible to make a Discord.JS bot to work with multi threading, planning this for a possible bot rewrite in another language in future.

# How to run
Locally:
1. Install Docker (https://www.docker.com).
2. Create your Discord Bot on https://discord.com/developers/applications (and invite it to your Discord server).
3. Download WhaproBot and extract the archive wherever you want.
4. Open the project folder in terminal and run "docker build -t <image_name>:<tag> <path_to_Dockerfile_._for_cd>" to build the docker container image.
5. Edit file env.list, you must add bot token and bot user id, otherwise it will not work.
6. Run "docker run --env-file env.list <image_name>:<tag>" to start bot.

# Configuration
Edit file "env.list" to add your configuration.
token=<string_bot_token>
botClientId=<string_bot_user_id>
serverSettingsPath=<string_TBD>
queueListItems=<integer_number_of_items_per_page_for_queue_command>
useLog=<boolean_show_hide_log>
inactivitySeconds=<integer_number_seconds_before_bot_leave_when_not_playing_0_is_infinite>
aloneSeconds=<integer_number_seconds_before_bot_leave_when_alone_0_is_infinite>
hexEmbedColor=<string_hex_value_example_00FF00>

# Future updates
What i plan for the future of this bot:
1. BugFixes every time a bug is found.
2. Add a user playlist system for user to save their own playlist.
3. Allow the custom deployment of commands to disable/enable commands.
4. Possibility to use a remote location for servers dj role configuration file.
5. Create a Docker image of the bot.
