require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // to parse JSON bodies
app.use(express.static('./')); // serves static files if you want to run it all together

// Create a Nodemailer transporter
// You'll need to enter your email credentials in a .env file or directly here.
const transporter = nodemailer.createTransport({
    // For example, if you are using Gmail, the service is 'gmail'
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com', // Replace with your email
        pass: process.env.EMAIL_PASS || 'your-app-password'     // Replace with your email password or app password
    }
});

// Endpoint to handle form submissions
app.post('/send-email', async (req, res) => {
    const { from_name, reply_to, subject, message } = req.body;

    if (!from_name || !reply_to || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Email options
    const mailOptions = {
        from: `"${from_name}" <${process.env.EMAIL_USER}>`, // Sender address (must be authenticated user)
        replyTo: reply_to,                                   // User's email address
        to: process.env.RECEIVER_EMAIL || 'elitesupport@dentaverse.uk', // Where you want to receive the email
        subject: `New Contact Form Submission: ${subject || 'Website Enquiry'}`,
        text: `You have received a new message from ${from_name} (${reply_to}).\n\nMessage:\n${message}`,
        html: `
            <h3>New Contact Form Submission</h3>
            <p><strong>Name:</strong> ${from_name}</p>
            <p><strong>Email:</strong> ${reply_to}</p>
            <p><strong>Subject:</strong> ${subject || 'Website Enquiry'}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, error: 'Failed to send email' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log('To set up Nodemailer:');
    console.log('1. Open or create a .env file');
    console.log('2. Add EMAIL_USER=your_email@gmail.com');
    console.log('3. Add EMAIL_PASS=your_app_password');
    console.log('4. Add RECEIVER_EMAIL=where_to_receive_emails@gmail.com');
});
