FROM node:18 AS builder
WORKDIR /home/backend

COPY . ./

RUN npm install
RUN npm run build


# Second Stage : Setup command to run your app using lightweight node image
FROM node:18-alpine
WORKDIR /home/backend
COPY --from=builder /home/backend ./
EXPOSE 3001
CMD ["npm", "run", "start:dev"]