@echo off
docker run --env-file env.list -v %C:\path\to\folder%>:/media/serverSettings/ whaprobot
timeout /t 3