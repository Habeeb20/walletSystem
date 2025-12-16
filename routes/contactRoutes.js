









// routes/contact.js
import express from 'express';
import ContactMessage from '../models/user/contactMessage.js';

import { sendContactEmail } from '../utils/security.js';

const router = express.Router();

// POST /api/contact
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Basic validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    // 1. Save to database FIRST (so it's never lost)
    const contactMessage = new ContactMessage({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || null,
      subject: subject.trim(),
      message: message.trim(),
    });

    await contactMessage.save();

    // 2. Try to send email (fire-and-forget style — don't fail the request if email fails)
    sendContactEmail({
      fromName: name,
      fromEmail: email,
      phone: phone || 'Not provided',
      subject,
      message,
    })
      .then(async () => {
        // If successful, update DB record
        contactMessage.emailSent = true;
        contactMessage.status = 'sent';
        await contactMessage.save();
        console.log(`Contact email sent for message ID: ${contactMessage._id}`);
      })
      .catch(async (emailError) => {
        console.error('Failed to send contact email:', emailError);
        // Update status even if email failed
        contactMessage.status = 'failed';
        await contactMessage.save();
      });

    // 3. Always return success to user (message is safely stored)
    res.json({
      message: 'Thank you! Your message has been received. We\'ll get back to you soon.',
    });
  } catch (err) {
    console.error('Contact form error:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

export default router;