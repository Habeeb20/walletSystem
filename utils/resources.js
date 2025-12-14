import nodemailer from 'nodemailer';

// Configure your SMTP or use SendGrid, Mailgun, etc.
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendContactEmail = async ({
  fromName,
  fromEmail,
  phone,
  subject,
  message,
}) => {
  const mailOptions = {
    from: `"flexipay" <${process.env.SMTP_USER}>`,
    to: 'atechsoftwares1@gmail.com',           // your support email
    replyTo: fromEmail,
    subject: `[Contact Form] ${subject}`,
    text: `
Name: ${fromName}
Email: ${fromEmail}
Phone: ${phone}

Message:
${message}
    `,
    html: `
      <h2>New Contact Message</h2>
      <p><strong>Name:</strong> ${fromName}</p>
      <p><strong>Email:</strong> ${fromEmail}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <hr>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};