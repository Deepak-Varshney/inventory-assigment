# Nexa Inventory - Setup Guide

This guide explains how to run **Nexa Inventory** locally.

---

## Prerequisites

Make sure you have the following installed:

* Node.js (v20 or later)
* npm
* Git
* MySQL Database (or Aiven MySQL)

---

# Clone the Repository

```bash
git clone <repository-url>

cd Nexa-Inventory
```

---

# Backend Setup

Navigate to the backend folder.

```bash
cd backend
```

Install dependencies.

```bash
npm install
```

### Create Environment File

Create a `.env` file inside the **backend** folder.

```env
PORT=3000
NODE_ENV=development

DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE?ssl-mode=REQUIRED"

DB_HOST=your-host.aivencloud.com
DB_PORT=20737
DB_USER=avnadmin
DB_PASSWORD=your_password
DB_NAME=defaultdb

JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d

BCRYPT_SALT_ROUNDS=10

```

### Generate Prisma Client

```bash
npx prisma generate
```

### Run Database Migrations

```bash
npx prisma migrate dev
```

### Start Backend

```bash
npm run dev
```

Backend will run on:

```text
http://localhost:5000
```

---

# Frontend Setup

Open another terminal.

```bash
cd frontend
```

Install dependencies.

```bash
npm install
```

### Create Environment File

Create a `.env.local` file inside the **frontend** folder.

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Start Frontend

```bash
npm run dev
```

Frontend will run on:

```text
http://localhost:3000
```

---

# Running the Application

Start both servers.

Backend

```bash
cd backend
npm run dev
```

Frontend

```bash
cd frontend
npm run dev
```

Open your browser and visit:

```text
http://localhost:3000
```

---

# Useful Prisma Commands

Generate Prisma Client

```bash
npx prisma generate
```

Create a Migration

```bash
npx prisma migrate dev --name migration_name
```

Open Prisma Studio

```bash
npx prisma studio
```

---

# Troubleshooting

### Prisma Client Error

Run:

```bash
npx prisma generate
```

### Database Connection Error

* Verify the `DATABASE_URL` in `.env`
* Ensure your MySQL/Aiven database is running
* Check that your IP is whitelisted (for Aiven)

### Frontend Cannot Connect to Backend

Verify that:

* Backend is running
* `NEXT_PUBLIC_API_URL` is correct

---

You're now ready to use **Nexa Inventory** locally.
