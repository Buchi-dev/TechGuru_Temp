const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    getUsersByType,
    searchUsers
} = require('../controllers/userController');

// Search users
router.get('/search', searchUsers);

// Register new user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Get user profile
router.get('/:userId', getUserProfile);

// Update user profile
router.put('/:userId', updateUserProfile);

// Get users by type (buyer/seller)
router.get('/type/:userType', getUsersByType);

module.exports = router; 