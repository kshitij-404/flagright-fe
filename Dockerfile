# Use the official Bun image
FROM oven/bun:latest

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and bun.lockb
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install

# Copy project files and folders to the current working directory
COPY . .

# Build the app
RUN bun run build

# Expose port 3000
EXPOSE 5173

# Serve the app
CMD ["bun", "run", "preview", "--host"]