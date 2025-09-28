app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: 'support@raigroups.in',
    subject: 'Contact Form Message',
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
  };
  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Configure your email credentials here
const transporter = nodemailer.createTransport({
  service: 'gmail', // or another SMTP service
  auth: {
    user: 'your-email@gmail.com', // replace with your email
    pass: 'your-app-password' // replace with your app password
  }
});

app.post('/api/inquiry', async (req, res) => {
  const { products, name, email, comment } = req.body;
  const mailOptions = {
    from: 'your-email@gmail.com', // sender address
  to: 'support@raigroups.in', // receiver address
    subject: 'Product Inquiry',
    text: `Products: ${products}\nName: ${name}\nEmail: ${email}\nComment: ${comment}`
  };
  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
