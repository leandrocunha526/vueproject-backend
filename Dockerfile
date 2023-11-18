# Base image
FROM node:18-alpine As development

WORKDIR /app

COPY . .

RUN npm install

CMD [ "./.docker/start.dev.sh" ]
