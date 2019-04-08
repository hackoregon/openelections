FROM node:11.4.0

WORKDIR /app
COPY package.json .
RUN yarn

COPY . /app

EXPOSE 4000
CMD ["yarn", "start"]

