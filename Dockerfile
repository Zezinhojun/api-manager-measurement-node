FROM node:18-alpine

WORKDIR /app

RUN mkdir -p /app/images

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3333

CMD ["npm", "run", "start"]