const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const email = 'noto96254@gmail.com';

const makeAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        let user = await User.findOne({ email });

        if (user) {
            user.role = 'admin';
            await user.save();
            console.log(`User ${email} updated to ADMIN.`);
        } else {
            user = await User.create({
                name: 'NOTO Admin',
                email: email,
                password: Math.random().toString(36).slice(-10), // Random password
                role: 'admin'
            });
            console.log(`User ${email} created as ADMIN.`);
        }

        mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

makeAdmin();
