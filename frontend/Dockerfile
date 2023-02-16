FROM node:18 AS builder
WORKDIR /home/frontend
RUN npm install



# Second Stage : Setup command to run your app using lightweight node image
FROM node:18-alpine
WORKDIR /home/frontend
COPY --from=builder /home/frontend ./
EXPOSE 3000
CMD ["npm", "start"]