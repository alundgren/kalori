FROM node:current-slim as build

WORKDIR /app/

COPY public/ /app/public
COPY src/ /app/src
COPY package.json /app/
COPY tsconfig.json /app/

FROM nginx:latest

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80