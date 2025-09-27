FROM node:18-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build the app for production
RUN npm run build

# Install serve to run the application
RUN npm install -g serve

# Expose the port the app will run on
EXPOSE 5173

# Command to run the app
CMD ["serve", "-s", "dist", "-l", "5173"]