FROM node:10 as builder

COPY . /app

WORKDIR /app

RUN npm set unsafe-perm true

RUN npm install

RUN $(npm bin)/ng build --prod

FROM nginx

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80