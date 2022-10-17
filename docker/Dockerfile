FROM node:16.18.0-alpine as builder
LABEL MAINTAINER="PIXIU"
WORKDIR /build
COPY . .
RUN npm config set registry https://registry.npmmirror.com/ && npm install && npm run build

FROM nginx:alpine
LABEL MAINTAINER="PIXIU"
COPY --from=builder /build/dist /usr/share/nginx/html/pixiu
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
