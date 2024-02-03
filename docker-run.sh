#!/bin/bash
docker run --env-file env.list -v %/home/user/path/to/directory/:/media/serverSettings/ whaprobot
sleep 3