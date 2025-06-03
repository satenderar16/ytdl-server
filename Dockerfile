FROM node:18-slim

# Install ffmpeg
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package*.json ./

# Install only production dependencies
RUN npm install --production

COPY . .

EXPOSE 45000

CMD ["node", "server.js"]
