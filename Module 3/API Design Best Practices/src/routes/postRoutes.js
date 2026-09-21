// const express = require('express');
// const controller = require('../controllers/postController');

// const router = express.Router();

// router.get('/getPosts', controller.listPosts);
// router.get('/getPost/:id', controller.getPost);
// router.post('/createPost', controller.createPost);
// router.post('/likePost/:id', controller.likePost);

// module.exports = router;

//postRoutes.js

const express = require('express');
const controller = require('../controllers/postController');

const router = express.Router();

router.get('/', controller.listPosts);
router.post('/', controller.createPost);
router.get('/:id', controller.getPost);
router.post('/:id/likes', controller.likePost);

module.exports = router;