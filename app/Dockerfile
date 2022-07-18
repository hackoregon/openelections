FROM node:11.4.0

WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm install

COPY . /app

EXPOSE 4000
CMD ["npm", "run", "start"]
