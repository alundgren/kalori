FROM node:22-slim@sha256:f576cc608b02e6b04bb0700e13be83eb5ceb7bb24584c3181b0f4ecfa0cd0edf as build

WORKDIR /app/

COPY public/ /app/public
COPY src/ /app/src
COPY package.json /app/
COPY tsconfig.json /app/

RUN npm install
run npm run build

FROM nginx:1.29-alpine@sha256:5616878291a2eed594aee8db4dade5878cf7edcb475e59193904b198d9b830de

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80