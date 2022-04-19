FROM node:16

RUN mkdir /www
WORKDIR /www

COPY ./package.json /www
RUN npm install -g npm@latest

COPY . /www
EXPOSE 8080

CMD ["npm", "start"]

