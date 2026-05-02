const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const promoteToAdmin = async (email) => {
    try {
        const user = await User.findOneAndUpdate({ email }, { role: 'admin' }, { new: true });
        if (user) {
            console.log(`User ${email} promoted to admin!`);
        } else {
            console.log(`User ${email} not found.`);
        }
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

const email = process.argv[2];
if (!email) {
    console.log('Please provide an email: node promote.js user@example.com');
    process.exit();
}

promoteToAdmin(email);
