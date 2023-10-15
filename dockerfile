FROM --platform=linux/amd64 node:18.15
RUN npm install -g pm2
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV PORT=3030
EXPOSE 3030
CMD ["pm2-runtime", "npm", "--", "start"]