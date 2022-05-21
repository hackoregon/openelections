FROM node:11.4.0

WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn install --network-timeout 1000000

COPY . /app

EXPOSE 4000
CMD ["yarn", "start"]
