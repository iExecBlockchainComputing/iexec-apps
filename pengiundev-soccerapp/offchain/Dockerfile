FROM node:11-alpine

RUN npm i axios ethers fs

COPY src/index.js /index.js

ENTRYPOINT ["node", "/index.js"]