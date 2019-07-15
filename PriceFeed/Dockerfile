FROM node:11-alpine

RUN npm i https ethers fs

COPY src/oracle.js /oracle.js

ENTRYPOINT ["node", "/oracle.js"]
