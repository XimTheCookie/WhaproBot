FROM node:16
COPY . /usr/src/app/WhaproBot
WORKDIR /usr/src/app/WhaproBot
RUN apt-get update && apt-get install -y ffmpeg
RUN npm install && npm run build && printf "ls\nnpm run deploy-commands\nnpm run start\n" > start-bot.sh
EXPOSE 8080
CMD ["/bin/sh", "start-bot.sh"]