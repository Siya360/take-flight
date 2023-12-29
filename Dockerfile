# Step 1: Build the React application
FROM node:20.10.0 AS build

# Set the working directory in the Docker container
WORKDIR /app

# Copy package.json and yarn.lock files
COPY client/package.json client/yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of your app's source code from your host to your image filesystem.
COPY client/ ./

# Build the application
RUN yarn build

# Step 2: Serve the application from Nginx
FROM nginx:stable-alpine

# Copy the build output to replace the default nginx contents.
COPY --from=build /app/build /usr/share/nginx/html

# Copy the Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to the outside once the container has launched
EXPOSE 80

# Start Nginx and keep it running
CMD ["nginx", "-g", "daemon off;"]