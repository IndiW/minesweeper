FROM node:22-bullseye

RUN mkdir -p /ui
WORKDIR /ui

COPY . .

RUN yarn
RUN chown -R node /ui/node_modules

EXPOSE 8080

CMD ["yarn", "run", "dev"]