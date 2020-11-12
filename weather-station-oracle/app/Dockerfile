FROM node:11-alpine
COPY weather-station.js /app/weather-station.js
COPY entrypoint.sh /entrypoint.sh
ARG APIKEY=APIKEY
ENV APIKEY=${APIKEY}
RUN npm i https ethers fs
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]