const nodemailer = require('nodemailer');

const sendMail = async (option) => {
  const mailOptions = {
    from: process.env.EMAILFROMADDRESS,
    to: option.email,
    subject: option.subject,
    html: option.message,
  };

  const transporter = nodemailer.createTransport({
    host: process.env.EMAILHOST,
    port: process.env.EMAILPORT,
    auth: {
      user: process.env.EMAILUSER,
      pass: process.env.EMAILPASSWORD,
    },
  });

  await transporter.sendMail(mailOptions);
};

module.exports = sendMail;
