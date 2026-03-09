import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import { PrismaClient } from "../app/generated/prisma/client"

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Fetching users and posts...");

  const usersRes = await fetch("https://jsonplaceholder.typicode.com/users");
  if (!usersRes.ok) {
    throw new Error(`Failed to fetch users: ${usersRes.status}`);
  }
  const users = await usersRes.json();

  for (const user of users) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone ?? null,
        website: user.website ?? null,
        company: user.company?.name ?? null,
        city: user.address?.city ?? null,
      },
      create: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone ?? null,
        website: user.website ?? null,
        company: user.company?.name ?? null,
        city: user.address?.city ?? null,
      },
    })
  }

  const postsRes = await fetch("https://jsonplaceholder.typicode.com/posts")
  if (!postsRes.ok) {
    throw new Error(`Failed to fetch posts: ${postsRes.status}`);
  }
  const posts = await postsRes.json();

  for (const post of posts) {
    await prisma.post.upsert({
      where: { id: post.id },
      update: {
        title: post.title,
        body: post.body,
        userId: post.userId,
      },
      create: {
        id: post.id,
        title: post.title,
        body: post.body,
        userId: post.userId,
      },
    })
  }

  console.log("Seed completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  })