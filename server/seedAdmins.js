const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const admins = [
    { name: "Aryan", email: "aryan407012@gmail.com", password: "Aryan@1274", role: "admin" },
    { name: "Admin Noto", email: "admin@noto.com", password: "admin123", role: "admin" }
];

const seedAdmins = async () => {
    try {
        for (const admin of admins) {
            const exists = await User.findOne({ email: admin.email });
            if (!exists) {
                await User.create(admin);
                console.log(`Admin created: ${admin.email}`);
            } else {
                exists.role = 'admin';
                await exists.save();
                console.log(`User already exists, updated to admin: ${admin.email}`);
            }
        }
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedAdmins();
