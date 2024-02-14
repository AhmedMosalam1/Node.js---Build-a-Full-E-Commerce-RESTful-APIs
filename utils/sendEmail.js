const nodemailer = require('nodemailer');

// if (process.env.NODE_ENV === "development") {
//     process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
//   }
  
  

// Nodemailer
const sendEmail = async (options) => {
  // 1) Create transporter ( service that will send email like "gmail","Mailgun", "mialtrap", sendGrid)
  const transporter = nodemailer.createTransport({
    host:"sandbox.smtp.mailtrap.io", //process.env.EMAIL_HOST,
    port:2525,//process.env.EMAIL_PORT, // if secure false port = 587, if true port= 465
    //secure: true,
    auth: {
      user:"e75633229c5653", //process.env.EMAIL_USER,
      pass:"c5a085ac8b5ec7"//process.env.EMAIL_PASSWORD,
    },
  });

  // 2) Define email options (like from, to, subject, email content)
  const mailOpts = {
    from: 'E-shop App <progahmedelsayed@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3) Send email
  await transporter.sendMail(mailOpts);
};

module.exports = sendEmail;