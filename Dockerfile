FROM node:22-alpine

WORKDIR /app

COPY . .

RUN yarn

CMD [ "./.docker/start.dev.sh" ]
