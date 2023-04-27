const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home_controller');

router.get('/home', homeController.home);
router.get('/home/:homeID', homeController.homeNo);
router.use('/users', require('./users'));
router.use('/posts', require('./posts'));
router.use('/comments', require('./comments'));

console.log('router loaded');

module.exports = router;