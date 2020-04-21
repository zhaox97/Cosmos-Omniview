FROM node:7-alpine

RUN mkdir /www
WORKDIR /www

COPY ./package.json /www
RUN npm install

COPY . /www
EXPOSE 8080

CMD ["npm", "start"]

