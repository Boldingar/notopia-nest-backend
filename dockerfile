# Use a Node.js base image
FROM node:18.18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) separately to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

ENV DB_HOST=phantasma.cnysygywmmwk.eu-central-1.rds.amazonaws.com
ENV DB_PORT=5432
ENV DB_USER=postgres
ENV DB_PASSWORD=nawy1234
ENV DB_NAME=phantasma
ENV QUEUE_NAME=historia-backend.fifo
ENV QUEUE_URL=https://sqs.eu-central-1.amazonaws.com/590183937449/historia-backend.fifo
ENV REGION=eu-central-1

# Build the application
RUN npm run build

# Expose port (if applicable)
EXPOSE 3000

# Start the application
CMD ["npm", "start"]