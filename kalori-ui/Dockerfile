FROM node:current-slim as build

WORKDIR /app/

COPY public/ /app/public
COPY src/ /app/src
COPY package.json /app/
COPY tsconfig.json /app/

RUN npm install
run npm run build

FROM nginx:latest

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80