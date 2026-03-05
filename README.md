# Streapost
Streapost is a simple posts list explorer built with **Next.js**, **Prisma**, and **SQLite**.

The application lists posts and allows filtering them by the author (`userId`). It also supports deleting posts and includes error handling for network failures.

The project was built as part of a technical challenge.

---

# Tech Stack

- Next.js
- TypeScript
- Prisma ORM
- SQLite
- Tailwind CSS

---

# Getting Started

## 1. Install dependencies

```bash
npm install
```

## 2. Configure environment variables

Create a .env file in the project root with the following:

DATABASE_URL="file:./dev.db"

For simplicity in this challenge, the .env file is committed to the repository.

## 3. Run database migrations

```bash
npx prisma migrate dev
```

This will create the SQLite database (dev.db) and apply the schema.

## 4. Seed the database

```bash
npx prisma db seed
```

The seed script fetches data from:

https://jsonplaceholder.typicode.com/users

https://jsonplaceholder.typicode.com/posts

and inserts it into the local SQLite database.

## 5. Run the development server
```bash
npm run dev
```

Open:

http://localhost:3000

# Project Structure
src/
  app/
  components/
prisma/
  schema.prisma
  seed.ts

# Features
- List posts
- Filter posts by userId
- Delete posts with confirmation modal
- Error handling for API failures

# Database

The application uses SQLite for simplicity.

## Tables
User
- id
- name
- username
- email
- phone
- website

Post
- id
- userId
- title
- body

## Relationship
User (1) → (N) Post
