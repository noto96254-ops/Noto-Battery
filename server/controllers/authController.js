const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register user
// @route   POST /api/auth/register
exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const user = await User.create({ name, email, password });
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await user.comparePassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Google Login
// @route   POST /api/auth/google
// @desc    Add new admin
// @route   POST /api/auth/add-admin
exports.addAdmin = async (req, res) => {
    const { name, email, password, phone } = req.body;
    try {
        let user = await User.findOne({ email });
        
        if (user) {
            // If user exists, promote them and update their details
            user.name = name;
            user.password = password; // Will be hashed by pre-save hook
            user.role = 'admin';
            if (!user.address) user.address = {};
            user.address.phone = phone;
            await user.save();
        } else {
            // Create new admin user
            user = await User.create({
                name,
                email,
                password,
                role: 'admin',
                address: { phone }
            });
        }

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.address?.phone
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.authGoogle = async (req, res) => {
    const { credential } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const { name, email, picture } = ticket.getPayload();
        
        let user = await User.findOne({ email });
        
        if (!user) {
            user = await User.create({
                name,
                email,
                password: Math.random().toString(36).slice(-10), // Random password for OAuth users
                avatar: picture
            });
        }

        res.json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar
            },
            token: generateToken(user._id)
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Google authentication failed' });
    }
};
