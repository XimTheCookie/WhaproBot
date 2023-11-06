@echo off
docker run --env-file env.list whaprobot
timeout /t 3