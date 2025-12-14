// routes/contact.js  (or inside your existing routes file)
import express from 'express';
import User from '../models/user/userModel.js';

import { sendContactEmail } from '../utils/email.js'; // you'll create this

const router = express.Router();

// POST /api/contact
router.post('/contact', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Basic validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    // Optional: Save to DB (you can create a ContactMessage model or just log)
    // For now we'll just send the email

    // Send email to admin/support
    await sendContactEmail({
      fromName: name,
      fromEmail: email,
      phone: phone || 'Not provided',
      subject,
      message,
    });

    res.json({ message: 'Message received! We will get back to you soon.' });
  } catch (err) {
    console.error('Contact form error:', err);
    res.status(500).json({ message: 'Failed to send message. Please try again.' });
  }
});

export default router;