FROM node:latest
# RUN apt-get update && apt-get install yarn -y
WORKDIR /usr/src/app/server
COPY . .
RUN npm install
RUN npx prisma generate
RUN npm run build
RUN mv ./setupDB.sh /usr/local/bin/setup.sh
EXPOSE 8080

ENTRYPOINT [ "setup.sh" ]
CMD [ "npm", "run", "start"]