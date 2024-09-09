FROM node

WORKDIR /usr/src/app

RUN npm install -g pnpm

COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

COPY package*.json .

RUN pnpm install

COPY libs libs

COPY apps/proxy-service apps/proxy-service

CMD sh -c "cd libs/common/src && npx prisma migrate deploy && pnpm start"