FROM node:11-alpine
COPY package-tracker.js /app/package-tracker.js
COPY entrypoint.sh /entrypoint.sh
ARG APIKEY=APIKEY
ENV APIKEY=${APIKEY}
RUN npm i https ethers fs
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]