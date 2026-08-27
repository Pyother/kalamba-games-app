FROM mhart/alpine-node:14.17.3 AS build-env
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.21.3-alpine AS production
ENV NODE_ENV=production
COPY --from=build-env /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
HEALTHCHECK --interval=1m --timeout=5s \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:80/ || exit 1
