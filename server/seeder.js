const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const products = [
  {
    title: "NOTO Heavy Duty Inverter Battery - 150Ah",
    price: 14999,
    category: "Inverter Batteries",
    description: "Premium tubular battery with 60 months warranty. Extra long life and low maintenance.",
    images: ["https://images.unsplash.com/photo-1619641782842-83d244a2b842?q=80&w=800"],
    rating: 4.8,
    reviews: 124
  },
  {
    title: "NOTO E-Rickshaw Max Power - 120Ah",
    price: 9499,
    category: "E-Rickshaw Batteries",
    description: "Designed for maximum mileage and high charge-discharge cycles. Fast charging support.",
    images: ["https://images.unsplash.com/photo-1594818821917-00147b7c50aa?q=80&w=800"],
    rating: 4.9,
    reviews: 89
  },
  {
    title: "NOTO Solar Tubular Battery - 200Ah",
    price: 18999,
    category: "Inverter Batteries",
    description: "Optimized for solar applications. Deep cycle capability with high efficiency.",
    images: ["https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=800"],
    rating: 4.7,
    reviews: 56
  },
  {
    title: "NOTO Compact ER-Lite - 100Ah",
    price: 7999,
    category: "E-Rickshaw Batteries",
    description: "Cost-effective solution for short-distance e-rickshaws. Reliable performance.",
    images: ["https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?q=80&w=800"],
    rating: 4.5,
    reviews: 42
  }
];

const importData = async () => {
    try {
        await Product.deleteMany();
        await Product.insertMany(products);
        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
