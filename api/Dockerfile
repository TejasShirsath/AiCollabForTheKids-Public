# Use a Node.js 18 slim base image
FROM node:18-slim

# Install openssl
RUN apt-get update -y && apt-get install -y openssl

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json from the api directory and install dependencies
COPY api/package.json ./
RUN npm install

# Copy the prisma schema from the root
COPY prisma ./prisma/

# Generate the prisma client
RUN npx prisma generate

# Copy the rest of the application code from the api directory
COPY api/ .

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD [ "node", "server.js" ]