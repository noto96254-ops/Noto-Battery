# 📋 NOTO Battery - Phase 2 Implementation Plan

This plan outlines the professional upgrades for the NOTO Battery platform, focusing on user experience, data privacy, and advanced order management.

## 🟢 Task 1: Independent & Persistent Cart System
- **Bug Fix**: Resolve the issue where adding different products merges them incorrectly in the UI.
- **User Scoping**: Update `CartContext` to use User IDs in `localStorage` (e.g., `cart_user_123`).
- **Database Sync**: (Optional/Recommended) Sync cart to MongoDB so users don't lose items when switching browsers.
- **Logic Check**: Ensure `addToCart` distinguishes between unique Product IDs correctly.

## 🔵 Task 2: User Profile & Personalization
- **Profile Page**: Create `/profile` route with a premium, dashboard-style UI.
- **Identity**: Display User Name, Email, and Unique User ID.
- **Address Book**:
    - Allow users to save a "Default Address" in their profile.
    - Update User Model to store address fields.
    - **Auto-Fill**: Automatically pull saved address into the Checkout form as the "Recommended" option.
- **UI Refresh**:
    - Improve Logout button styling.
    - **Navbar Logic**: Show "Login" button for guests; show "Profile Icon" for logged-in users.

## 🟡 Task 3: Advanced Order Management
- **Tabbed Interface**:
    - **Tracking Tab**: View active orders (Placed, Confirmed, Shipped).
    - **History Tab**: View completed (Delivered) or Cancelled orders.
- **Status Notifications**: 
    - Trigger an automated email via Nodemailer whenever an Admin updates an order status (e.g., "Your order has been Shipped!").

## 🔴 Task 4: Admin Panel & Backend Fixes
- **Edit Product Bug**: Fix the "Edit Product" functionality in the Admin Dashboard (ensure PUT requests work with Cloudinary).
- **Order Status Control**: Add a dropdown in the Admin Order view to easily update status (Pending -> Shipped -> Delivered).

---

## 🚦 Execution Order
1. **Cart Fixes** (Immediate Priority)
2. **Profile & Address Book**
3. **Order Tracking & History Tabs**
4. **Admin Fixes & Status Emails**
