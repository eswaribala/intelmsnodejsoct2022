FROM node:alpine
WORKDIR /usr/app
COPY package*.json ./
RUN npm install --force
COPY . . 
EXPOSE 3005
CMD npm run dev 3005
