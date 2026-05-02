const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;
    console.log('Auth Header:', req.headers.authorization);
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            console.log('User found:', req.user?.email, 'Role:', req.user?.role);
            return next();
        } catch (error) {
            console.error('JWT Error:', error.message);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }
    if (!token) {
        console.log('No token provided');
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        console.log('Admin check passed');
        return next();
    } else {
        console.log('Admin check failed. User Role:', req.user?.role);
        return res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { protect, admin };
