FROM node:18.20.4-alpine
WORKDIR /usr/src/lunchbot

COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./

COPY ./src ./src

RUN ls -a

RUN yarn
RUN yarn build

RUN ls -a ./src
RUN ls -a ./dist

ENV MONGO_CONN_STRING="mongodb://mongo:27017/lunchbot"

CMD ["node", "./dist/index.js"]

