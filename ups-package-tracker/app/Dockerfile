FROM node:11-alpine
COPY package-tracker.js /src/package-tracker.js
COPY entrypoint.sh /entrypoint.sh
RUN npm i https ethers fs
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]