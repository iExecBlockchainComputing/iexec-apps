FROM node:11-alpine

RUN npm i https fs ethers

COPY src/doracle.js /doracle.js

ENTRYPOINT ["node", "/doracle.js"]
