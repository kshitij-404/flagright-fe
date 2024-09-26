
# Flagright Assignment - Frontend

This is the frontend repository for the Flagright hiring assignment.

Deployed Link: https://flagright-fe.vercel.app

Server URL (for testing APIs): https://flagrightbe-gmgagzcuf8cdbpdy.centralindia-01.azurewebsites.net

Video Demonstration Link: https://youtu.be/oGZboEHf7NA

Backend Repository Link: https://github.com/kshitij-404/flagright-assignment




## Tech Stack

**Client:** React, Mantine, TypeScript, Bun

**Server:** Bun, Express, MongoDB, TypeScript


## Run Locally

Clone the project

```bash
  git clone https://github.com/kshitij-404/flagright-fe.git
```

Go to the project directory

```bash
  cd flagright-fe
```

Install dependencies

```bash
  bun install
```

Create a .env file 

```bash
  touch .env
```

Use the .env.example file to populate the backend URL in .env file (replace with your backend URL or Live Server URL: https://flagrightbe-gmgagzcuf8cdbpdy.centralindia-01.azurewebsites.net)

```bash
  VITE_BASE_URL=http://localhost:3000 
```

Start the server

```bash
  bun run dev
```

Or to build and run

```bash
  bun run build
  bun run preview --host
```

### Using Docker

Clone the project

```bash
  git clone https://github.com/kshitij-404/flagright-fe.git
```

Go to the project directory

```bash
  cd flagright-fe
```

Create a .env file 

```bash
  touch .env
```

Use the .env.example file to populate the backend URL in .env file (replace with your backend URL or Live Server URL: https://flagrightbe-gmgagzcuf8cdbpdy.centralindia-01.azurewebsites.net)

```bash
  VITE_BASE_URL=http://localhost:3000 
```

Build Docker Image

```bash
  docker build -t flagright-frontend .
```

Run Docker Image
```bash
  docker run -p 5173:5173 flagright-frontend
```
