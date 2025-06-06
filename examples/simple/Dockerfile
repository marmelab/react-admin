# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

EXPOSE 8080

CMD ["npm", "run", "dev", "--", "--host", "--port", "8080"]
