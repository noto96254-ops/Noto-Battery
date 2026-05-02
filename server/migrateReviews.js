const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const migrateReviews = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('◇ MongoDB Connected for migration...');

        const products = await Product.find({});
        console.log(`◈ Found ${products.length} products to check...`);

        for (let product of products) {
            // Check if 'reviews' is a number (primitive) instead of an array
            // Since we updated the schema, Mongoose might struggle to even load them if they clash
            // We use the raw database update to be safe
            
            await mongoose.connection.db.collection('products').updateOne(
                { _id: product._id },
                [
                    {
                        $set: {
                            numReviews: {
                                $cond: {
                                    if: { $isArray: "$reviews" },
                                    then: { $size: "$reviews" },
                                    else: { $ifNull: ["$reviews", 0] }
                                }
                            },
                            reviews: {
                                $cond: {
                                    if: { $isArray: "$reviews" },
                                    then: "$reviews",
                                    else: []
                                }
                            }
                        }
                    }
                ]
            );
        }

        console.log('✅ Migration successful! All products are now using the new review system.');
        process.exit();
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
};

migrateReviews();
