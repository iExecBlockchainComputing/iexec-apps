FROM node:11-alpine
COPY tls-notary.js /src/tls-notary.js
COPY entrypoint.sh /entrypoint.sh
RUN npm i https ethers fs node-forge
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]