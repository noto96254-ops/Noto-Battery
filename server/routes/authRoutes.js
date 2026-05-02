const express = require('express');
const { registerUser, loginUser, authGoogle, addAdmin } = require('../controllers/authController');
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', authGoogle);
router.post('/add-admin', protect, admin, addAdmin);

router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

module.exports = router;

