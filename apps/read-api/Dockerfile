FROM node

WORKDIR /usr/src/app

RUN npm install -g pnpm

COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

COPY package*.json .

RUN pnpm install

COPY libs libs

COPY apps/read-api apps/read-api

RUN cd libs/common/src && npx prisma generate