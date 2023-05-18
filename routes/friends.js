const express = require('express');
const router = express.Router();
const friendsController = require('../controllers/friends_controller');

router.post('/add', friendsController.add);
router.get('/delete/:id', friendsController.delete);

module.exports = router;