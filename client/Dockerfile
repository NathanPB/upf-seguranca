# Stage 1 - Build Environment
FROM node:14.4.0-slim as build
WORKDIR /app
COPY . ./
RUN npm install
RUN npm run build

# Stage 2 - Production Server
FROM nginx:1.16.0-alpine
COPY  --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
