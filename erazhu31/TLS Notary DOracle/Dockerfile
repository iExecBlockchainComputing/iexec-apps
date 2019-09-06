FROM node:11-alpine

COPY src/oracle.js /src/oracle.js


RUN npm i https ethers fs get-ssl-certificate
ENTRYPOINT ["node", "src/oracle.js"]


