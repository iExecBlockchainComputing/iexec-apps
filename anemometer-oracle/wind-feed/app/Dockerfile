FROM node:11-alpine
COPY wind-feed.js /app/wind-feed.js
COPY entrypoint.sh /entrypoint.sh
ARG APIKEY=APIKEY
ENV APIKEY=${APIKEY}
RUN npm i https ethers fs
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]