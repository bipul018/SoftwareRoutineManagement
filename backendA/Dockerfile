FROM node:20.5-alpine

WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm i
COPY ./ ./

CMD node db.js ; npm start