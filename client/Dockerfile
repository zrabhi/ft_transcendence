FROM node:latest

WORKDIR /usr/src/app/client
COPY package.json ./
RUN npm install
COPY . .
EXPOSE 3000
RUN chmod 777 ./script.sh
ENTRYPOINT ["bash", "script.sh"]