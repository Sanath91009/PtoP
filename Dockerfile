FROM ubuntu:20.04
FROM node:18
WORKDIR /usr/src
COPY . .
RUN cd client && npm install && npm run build
WORKDIR /usr/src


RUN apt update
RUN yes | apt upgrade
RUN yes | apt install -y chromium
# RUN apk add -U --no-cache --allow-untrusted udev ttf-freefont chromium git
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV CHROMIUM_PATH /usr/bin/chromium
RUN npm install

EXPOSE 8080


CMD ["node", "index.js"]