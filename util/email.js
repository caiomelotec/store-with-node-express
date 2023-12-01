const nodemailer = require("nodemailer");

const sendEmail = async (option) => {
  // create a transporter
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  // define email options
  const emailOptions = {
    from: process.env.EMAIL_USER,
    to: option.email,
    subject: option.subject,
    text: option.message,
  };

  await transporter.sendMail(emailOptions);
};

module.exports = sendEmail;
