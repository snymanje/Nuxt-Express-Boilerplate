const nodemailer = require("nodemailer");

const sendMail = async option => {
  const transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: "25",
    auth: {
      user: "bea652e93b4eaa",
      pass: "3c9f5769879783"
    }
  });

  const mailOptions = {
    from: "jean.snyman@gamil.com",
    to: option.email,
    subject: option.subject,
    html: option.message
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendMail;
