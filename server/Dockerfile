FROM node:14.4.0-slim
COPY . /srv
WORKDIR /srv
RUN npm install
EXPOSE 8080
CMD ["npm", "start"]
