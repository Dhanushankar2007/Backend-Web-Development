const prisma = require('../src/db/prisma');

async function main() {
  const user = await prisma.user.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Demo User',
    },
  });

  await prisma.post.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      title: 'First post',
      body: 'The contract survives storage changes.',
      authorId: user.id,
    },
  });

  await prisma.post.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      title: 'Second post',
      body: 'Migrations record database design.',
      authorId: user.id,
    },
  });

  console.log('Seed data inserted successfully');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });