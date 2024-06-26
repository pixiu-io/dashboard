FROM node:16.18.0-alpine as builder
LABEL MAINTAINER="PIXIU"
WORKDIR /build
ARG NPM_REGISTRY
COPY . .
RUN npm config set registry ${NPM_REGISTRY} && \
    npm install && \
    npm run build

FROM ubuntu:latest as certbuilder
WORKDIR /certs
LABEL MAINTAINER="PIXIU"
RUN apt-get update && apt-get install -y openssl
RUN openssl genrsa -out key.pem 2048
RUN openssl req -new -key key.pem -out csr.pem -subj "/CN=127.0.0.1"
RUN openssl x509 -req -in csr.pem -signkey key.pem -out cert.pem -days 36500

FROM nginx:alpine
LABEL MAINTAINER="PIXIU"
RUN mkdir /etc/nginx/conf.d/ssl/
COPY --from=builder /build/dist /usr/share/nginx/html/pixiu
COPY --from=certbuilder /certs  /etc/nginx/conf.d/ssl/
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
