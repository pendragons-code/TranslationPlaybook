FROM node:18-alpine
WORKDIR /app
RUN apk update && apk add git ca-certificates

COPY ["package.json", "./"]
RUN npm install
RUN npm install -g pm2

COPY . .
CMD ["npm", "run", "deploy"]
