// const service = require('../services/postService');
// const http = require('../utils/http');

// function listPosts(req, res) {
//   const rows = service.listPosts(req.query);
//   return http.sendList(res, rows);
// }

// function getPost(req, res) {
//   const post = service.getPost(req.params.id);
//   if (!post) {
//     return http.sendError(res, 404, { message: 'post missing' });
//   }
//   return http.sendOk(res, post);
// }

// function createPost(req, res) {
//   const post = service.createPost(req.body);
//   return http.sendCreated(res, post);
// }

// function likePost(req, res) {
//   const post = service.likePost(req.params.id);
//   return http.sendOk(res, { ok: true, likes: post.likes });
// }

// function explode(req, res) {
//   try {
//     service.explode();
//   } catch (err) {
//     return http.sendError(res, 500, { error: err.message, stack: err.debug || err.stack });
//   }
// }

// module.exports = {
//   listPosts,
//   getPost,
//   createPost,
//   likePost,
//   explode
// };

//postController.js

const service = require('../services/postService');
const http = require('../utils/http');

function listPosts(req, res, next) {
  try {
    const { data, meta } = service.listPosts(req.query);
    return http.sendSuccess(res, 200, data, meta);
  } catch (err) {
    return next(err);
  }
}

function getPost(req, res, next) {
  try {
    const post = service.getPost(req.params.id);
    return http.sendSuccess(res, 200, post);
  } catch (err) {
    return next(err);
  }
}

function createPost(req, res, next) {
  try {
    const post = service.createPost(req.body);
    res.set('Location', `/api/posts/${post.id}`);
    return http.sendSuccess(res, 201, post);
  } catch (err) {
    return next(err);
  }
}

function likePost(req, res, next) {
  try {
    const post = service.likePost(req.params.id);
    return http.sendSuccess(res, 201, { postId: post.id, likes: post.likes });
  } catch (err) {
    return next(err);
  }
}

function triggerInternalFailure(req, res, next) {
  try {
    service.explode();
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listPosts,
  getPost,
  createPost,
  likePost,
  triggerInternalFailure
};
