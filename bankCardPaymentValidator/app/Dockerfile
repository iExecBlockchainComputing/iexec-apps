FROM node:11-alpine
COPY dwolla-card-validator.js /src/dwolla-card-validator.js
COPY entrypoint.sh /entrypoint.sh
RUN npm i https ethers fs dwolla-v2
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
