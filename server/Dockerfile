FROM node:12
RUN apt update && apt install nginx -y
WORKDIR /app
COPY package.json ./
RUN npm install
COPY ./ ./
EXPOSE 3000
CMD npm run start
