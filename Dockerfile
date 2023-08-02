FROM node:18.13-alpine

RUN apk add --no-cache --virtual .yarn-deps curl gnupg && \
  curl -o- -L https://yarnpkg.com/install.sh | sh && \
  apk del .yarn-deps

WORKDIR /usr/src/app
COPY package.json ./

RUN yarn install
COPY . .
RUN yarn build

EXPOSE 8000
EXPOSE 8001

CMD ["yarn", "start"]
