# Base image
FROM node:16-bullseye As development

WORKDIR /app

COPY . .

RUN npm install

CMD [ "./.docker/start.dev.sh" ]
