
const prisma = require('../db/prisma');

function handleDatabaseError(error) {
  const safeError = new Error('Database operation failed');

  if (error.code === 'P2002' || error.code === 'P2003') {
    safeError.message = 'Database constraint violation';
    safeError.statusCode = 409;
  } else {
    safeError.statusCode = 500;
  }

  throw safeError;
}

async function findAll() {
  try {
    return await prisma.post.findMany({
      orderBy: { id: 'asc' },
    });
  } catch (error) {
    handleDatabaseError(error);
  }
}

async function findById(id) {
  try {
    return await prisma.post.findUnique({
      where: { id: Number(id) },
    });
  } catch (error) {
    handleDatabaseError(error);
  }
}

async function create(fields) {
  try {
    return await prisma.post.create({
      data: {
        title: fields.title,
        body: fields.body || '',
        authorId: fields.authorId,
      },
    });
  } catch (error) {
    handleDatabaseError(error);
  }
}

async function update(id, patch) {
  try {
    const existing = await findById(id);
    if (!existing) return null;

    return await prisma.post.update({
      where: { id: Number(id) },
      data: {
        ...(patch.title !== undefined && { title: patch.title }),
        ...(patch.body !== undefined && { body: patch.body }),
      },
    });
  } catch (error) {
    handleDatabaseError(error);
  }
}

async function remove(id) {
  try {
    const existing = await findById(id);
    if (!existing) return false;

    await prisma.post.delete({
      where: { id: Number(id) },
    });

    return true;
  } catch (error) {
    handleDatabaseError(error);
  }
}

module.exports = { findAll, findById, create, update, remove };
