FROM node:11

ADD src/oracle.js oracle.js

RUN npm i https ethers fs

ENTRYPOINT ["node", "oracle.js"]
