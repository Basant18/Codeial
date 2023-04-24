const express = require('express');
const router = express.Router();

const postController = require('../controllers/posts_controller');

router.get('/',postController.posts);
router.post('/create', postController.create);

module.exports = router;