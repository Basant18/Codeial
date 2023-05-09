const express = require('express');
const router = express.Router();

const friendsApi = require('../../../controllers/api/v2/friends_api');

router.use('/', friendsApi.friends);

module.exports = router;