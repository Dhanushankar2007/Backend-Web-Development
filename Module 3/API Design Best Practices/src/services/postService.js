// const store = require('../data/postStore');

// function listPosts(query = {}) {
//   // intentionally poor design: no pagination, no metadata, no contract standardisation
//   return store.getAllPosts();
// }

// function getPost(id) {
//   return store.getPostById(id);
// }

// function createPost(body = {}) {
//   return store.createPost({
//     title: body.title,
//     author: body.author
//   });
// }

// function likePost(id) {
//   const post = store.incrementLikes(id);
//   if (!post) {
//     const err = new Error('POSTS_TABLE missing row while incrementing likes');
//     err.statusCode = 500;
//     err.debug = 'FakeStack: at postService.js:19:11';
//     throw err;
//   }
//   return post;
// }

// function explode() {
//   const err = new Error('SQLITE_CONSTRAINT in posts table');
//   err.statusCode = 500;
//   throw err;
// }

// module.exports = {
//   listPosts,
//   getPost,
//   createPost,
//   likePost,
//   explode
// };

//postServices.js

const store = require('../data/postStore');
const ApiError = require('../utils/apiError');

const DEFAULT_LIMIT = 2;
const MAX_LIMIT = 50;

function parsePositiveInt(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return parsed;
}

function listPosts(query = {}) {
  const all = store.getAllPosts();

  const page = parsePositiveInt(query.page, 1);
  const requestedLimit = parsePositiveInt(query.limit, DEFAULT_LIMIT);
  const limit = Math.min(requestedLimit, MAX_LIMIT);

  const total = all.length;
  const totalPages = total === 0 ? 0 : Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const data = all.slice(offset, offset + limit);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    }
  };
}

function assertValidId(id) {
  const parsed = Number(id);
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new ApiError(400, 'INVALID_POST_ID', 'Post id must be a positive integer.');
  }
  return parsed;
}

function getPost(id) {
  const postId = assertValidId(id);
  const post = store.getPostById(postId);
  if (!post) {
    throw new ApiError(404, 'POST_NOT_FOUND', `No post exists with id ${postId}.`);
  }
  return post;
}

function createPost(body = {}) {
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const author = typeof body.author === 'string' ? body.author.trim() : '';

  const details = [];
  if (!title) details.push({ field: 'title', issue: 'required non-empty string' });
  if (!author) details.push({ field: 'author', issue: 'required non-empty string' });
  if (details.length > 0) {
    throw new ApiError(400, 'VALIDATION_FAILED', 'Request body is invalid.', details);
  }

  return store.createPost({ title, author });
}

function likePost(id) {
  const postId = assertValidId(id);
  const post = store.incrementLikes(postId);
  if (!post) {
    throw new ApiError(404, 'POST_NOT_FOUND', `No post exists with id ${postId}.`);
  }
  return post;
}

function explode() {
  const err = new Error('SQLITE_CONSTRAINT in posts table');
  err.statusCode = 500;
  throw err;
}

module.exports = {
  listPosts,
  getPost,
  createPost,
  likePost,
  explode,
  DEFAULT_LIMIT,
  MAX_LIMIT
};