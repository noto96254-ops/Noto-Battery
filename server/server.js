const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const mongoose = require('mongoose');
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    console.error(`◈ CRITICAL ERROR: Missing environment variables: ${missingEnvVars.join(', ')}`);
    console.error('Please ensure they are defined in your .env file or deployment environment.');
    process.exit(1);
}

const app = express();

app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const reportRoutes = require('./routes/reportRoutes');

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('◇ MongoDB Connected Successfully'))
    .catch(err => console.log('◈ MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/reports', reportRoutes);

app.get('/api/test-email', async (req, res) => {
    const { sendOrderConfirmation } = require('./config/emailConfig');
    try {
        await sendOrderConfirmation(process.env.EMAIL_USER, {
            _id: 'TEST_ORDER_123',
            totalAmount: 9999,
            address: { detail: '123 Test St', city: 'Test City', pincode: '123456' }
        });
        res.json({ message: 'Test email triggered. Check server console for logs.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});





app.get('/', (req, res) => {


    res.send('NOTO Battery API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(`◈ Error: ${err.message}`);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
