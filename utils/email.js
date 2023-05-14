const nodemailer = require('nodemailer');

const sendMail = async (options) => {
  // create transporter
  const transporter = nodemailer.createTransport({
    // host: process.env.EMAIL_HOSTNAME,
    // port: process.env.EMAIL_PORT,
    // auth: {
    //   user: process.env.EMAIL_USERNAME,
    //   pass: process.env.EMAIL_PASSWORD,
    // },
    service: 'gmail',
    secure: false,
    auth: {
      user: 'jeehammad840@gmail.com',
      pass: 'khlovqphnxfnktze',
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // mail options
  const mailOptions = {
    from: 'Artizen <hammad840@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // send the mail

  await transporter.sendMail(mailOptions);
};

module.exports = sendMail;
