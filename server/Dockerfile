FROM node:18-alpine as dev

WORKDIR /usr/src/app

COPY --chown=node:node package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY --chown=node:node . .

RUN npx prisma generate

WORKDIR /usr/src/app/server

USER node

CMD [ "yarn", "start:dev" ]