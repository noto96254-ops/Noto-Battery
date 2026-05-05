const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

const sendOrderConfirmation = async (email, orderDetails) => {
    try {
        console.log(`◇ Attempting to send confirmation email via Resend API to: ${email}`);
        
        const { data, error } = await resend.emails.send({
            from: 'NOTO Battery <onboarding@resend.dev>',
            to: [email],
            subject: 'Order Confirmation - NOTO Battery',
            html: `
                <div style="font-family: sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #E2FF31; background: #000; padding: 10px; display: inline-block;">NOTO BATTERY</h2>
                    <p>Hi there,</p>
                    <p>Thank you for your order! We've received your payment and are processing your order.</p>
                    <hr />
                    <p><strong>Order ID:</strong> ${orderDetails._id}</p>
                    <p><strong>Total Amount:</strong> ₹${orderDetails.totalAmount.toLocaleString()}</p>
                    <p><strong>Shipping to:</strong> ${orderDetails.address.detail}, ${orderDetails.address.city} - ${orderDetails.address.pincode}</p>
                    <hr />
                    <p>We'll notify you once your battery is shipped!</p>
                    <p>Best Regards,<br />Team NOTO</p>
                </div>
            `
        });

        if (error) {
            console.error('◈ Resend Confirmation Email error:', error);
        } else {
            console.log('◇ Resend Confirmation email sent successfully:', data.id);
        }
    } catch (error) {
        console.error('◈ Resend Confirmation Exception:', error);
    }
};

const sendOrderStatusUpdate = async (email, orderDetails) => {
    try {
        console.log(`◇ Attempting to send status update email via Resend API to: ${email}`);
        
        const { data, error } = await resend.emails.send({
            from: 'NOTO Battery <onboarding@resend.dev>',
            to: [email],
            subject: `Order Update: ${orderDetails.orderStatus} - NOTO Battery`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #E2FF31; background: #000; padding: 10px; display: inline-block;">NOTO BATTERY</h2>
                    <p>Great news!</p>
                    <p>The status of your order <strong>#${orderDetails._id.toString().slice(-6).toUpperCase()}</strong> has been updated to:</p>
                    <div style="font-size: 24px; font-weight: bold; color: #E2FF31; background: #000; padding: 15px; text-align: center; border-radius: 10px; margin: 20px 0;">
                        ${orderDetails.orderStatus.toUpperCase()}
                    </div>
                    <p>You can track your order details in your profile dashboard.</p>
                    <p>Best Regards,<br />Team NOTO</p>
                </div>
            `
        });

        if (error) {
            console.error('◈ Resend Status Update Email error:', error);
        } else {
            console.log('◇ Resend Status update email sent successfully:', data.id);
        }
    } catch (error) {
        console.error('◈ Resend Status Update Exception:', error);
    }
};

module.exports = { sendOrderConfirmation, sendOrderStatusUpdate };
