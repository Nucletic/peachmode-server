# Use the official Node.js image as a base
FROM node:14

# Create and set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies inside the container
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the application port
EXPOSE 5000

# Set environment variables
ENV MONGO_URL=mongodb://mongo:27017/peachmode

# Start the application
CMD ["npm", "start"]