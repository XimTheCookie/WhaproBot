# WhaproBot
My small attempt at making a Discord Music Bot in Node and using Docker.
Will get occasionally updated for new features and/or bugfixes, expecially since i use this myself.


# How to run
1. Install Docker (https://www.docker.com).
2. Create your Discord Bot on https://discord.com/developers/applications (and invite it to your Discord server).
3. Clone WhaproBot wherever you want.
4. Run "docker-build" script.
5. Edit file env.list, you must add bot token and bot user id, otherwise it will not work.
6. Run "docker-run" script to start the bot.

# Configuration
Edit file "env.list" to add your configuration.

token=<string_bot_token>

botClientId=<string_bot_user_id>

serverSettingsPath=<string_TBD_path_where_to_save_server_dj_roles_json_currently_not_saving>

queueListItems=<integer_number_of_items_per_page_for_queue_command>

useLog=<boolean_show_hide_log>

inactivitySeconds=<integer_number_seconds_before_bot_leave_when_not_playing_0_is_infinite>

aloneSeconds=<integer_number_seconds_before_bot_leave_when_alone_0_is_infinite>

hexEmbedColor=<string_hex_value_example_00FF00>


# Available slash (/) commands
help - Displays a list of available commands.

play - Adds a track to the queue, use "next" option to add as the next in queue. (Supports both links and search query)

*skip - Skips the track.

loop - Enable/disables loop for queue or current track.

*stop - Kicks bot from VC and clears the queue.

pause - Pauses the player.

resume - Resumes the player.

*join - Move bot to your VC (mantains queue).

remove - Remove a track from queue (using an index).

queue - Displays the current queue. Page option is available to display other pages (when multiple are available).

move - Switches the position of two tracks in the queue.

info - Displays info about currently playing track or a track in queue.

*clear - Clears the queue, use "user" option to specify a filter and remove only tracks requested by that user.

about - Info about bot.

*setdj - Update the djrole (would not currently save this option if bot is run on Docker, when restarted)


*Commands are adjusted to behave differently if multiple users are in the same VC as the bot (Requiring an Admin or DJ to be used entirely, in some cases).


# Future updates
What i plan for the future of this bot:
1. BugFixes every time a bug is found (and updating dependencies when required)
2. Add a user playlist system for user to save their own playlist.
3. Allow the custom deployment of commands to disable/enable commands.
4. Possibility to use a remote location for servers dj role configuration file.
