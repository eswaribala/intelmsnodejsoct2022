FROM node:lts-alpine3.15
WORKDIR /usr/app
COPY package*.json ./
RUN npm install --force
COPY . . 
EXPOSE 3000
CMD npm start
