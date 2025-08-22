const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.patch('/:id/approve', userController.approveUser);
router.post('/signin', userController.loginUser);
router.post('/signup', userController.registerUser);
router.get('/current', userController.currentUser);
module.exports = router;
