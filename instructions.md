📄 NOTO Battery Website – Product Requirements Document (PRD)
🧭 1. Project Overview

Project Name: NOTO Battery Website
Type: Full E-commerce Website
Goal:

Showcase battery products (Inverter, E-Rickshaw, etc.)
Enable users to browse, view, and purchase products
Provide admin control for managing products, users, and orders
🎯 2. Core Features
🏠 Landing Page
Hero banner with brand message
Navigation bar (Home, Products, Profile, Cart)
Product carousel (featured products)
Sections:
About Company
Categories preview
“Shop Now” CTA
Footer:
Contact info
Social links
Floating WhatsApp button (auto message enabled)
🛍️ Product Listing Page
Category-based filtering:
Inverter Batteries
E-Rickshaw Batteries
(Future categories expandable)
Product cards:
Image
Title
Price
“View Details” button
📦 Product Detail Page
Image carousel (multiple images)
Product title & price
Description
Quantity selector
Buttons:
Add to Cart
Buy Now
Reviews section (only logged-in users)
🛒 Cart System
Add/remove products
Update quantity
Cart icon in navbar (top-right)
Proceed to checkout
💳 Checkout Flow
Address form (India-wide shipping)
Payment options:
Razorpay (primary)
COD (optional if you enable later)
Payment success → Order confirmation page
👤 Authentication System
Email + Password
Google Login (OAuth via Google)
JWT-based session handling
📦 Order System
Orders stored in DB (MongoDB Atlas)
Email confirmation (via Gmail App Password)
Order status:
Pending
Confirmed
Shipped
Delivered
Cancelled
👤 User Profile Page
Name + Profile Picture
Tabs:
Orders
Order History
Future extensibility
💬 WhatsApp Integration
Floating button (fixed bottom-right)

Auto message:

“Hi, I want to inquire about [Product Name]”

🔐 3. Admin Panel (Advanced)

Accessible only by admin login.

📦 Products Management
Add product form:
Title
Price (editable anytime)
Category
Description
Multiple images (via Cloudinary or URL)
Product list:
Edit / Delete
👥 Users Management
List of users
Admin user fixed at top
Actions:
Suspend
Delete
📦 Orders Management
Order list with filters:
Pending / Delivered / Cancelled
Manual status update
📊 Analytics (Basic)
Total Users
Total Orders
Total Revenue
🧱 4. Tech Stack (FINAL)
🎨 Frontend
React + Vite
Tailwind CSS
Dark/Light Mode
⚙️ Backend
Node.js + Express
🗄️ Database
MongoDB Atlas
🖼️ Media Storage
Cloudinary
🔐 Auth
JWT + Google OAuth
💳 Payment
Razorpay
☁️ Hosting (FREE)
Frontend → Vercel
Backend → Render
📧 Email
Nodemailer (Gmail App Password)
🧩 5. Database Schema (Simplified)
User
_id
name
email
password (hashed)
googleId (optional)
role (user/admin)
createdAt
Product
_id
title
price
category
description
images[]
createdAt
Order
_id
userId
products[]
totalAmount
address
paymentStatus
orderStatus
createdAt
Review
_id
userId
productId
rating
comment
createdAt
🔗 6. API Structure (Important for Antigravity)
Auth
POST /api/auth/register
POST /api/auth/login
POST /api/auth/google
Products
GET /api/products
GET /api/products/:id
POST /api/products (admin)
PUT /api/products/:id
DELETE /api/products/:id
Cart
POST /api/cart
GET /api/cart
Orders
POST /api/orders
GET /api/orders (user/admin)
PUT /api/orders/:id (update status)
Reviews
POST /api/reviews
GET /api/reviews/:productId
🔄 7. User Flow
User visits site
Browses products
Clicks product → views details
Adds to cart
Login / Signup
Checkout → Razorpay
Order placed
Email confirmation sent
🔄 8. Admin Flow
Login as admin
Access admin panel
Add/edit/delete products
Manage orders
View analytics
🧁 9. UI/UX Guidelines
Modern e-commerce style (Flipkart-inspired)
Card-based design
Clean spacing
Fast loading
Responsive (mobile-first)
📁 10. CLEAN Directory Structure (Very Important)
Frontend (client/)
src/
 ├── components/
 ├── pages/
 ├── hooks/
 ├── context/
 ├── services/   (API calls)
 ├── utils/
 ├── assets/
 ├── App.jsx
 └── main.jsx
Backend (server/)
├── controllers/
├── routes/
├── models/
├── middleware/
├── config/
├── utils/
├── server.js