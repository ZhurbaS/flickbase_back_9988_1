const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
require('dotenv').config();

let transporter = nodemailer.createTransport({
  service: 'Gmail',
  secure: true,
  auth: {
    user: `${process.env.EMAIL}`,
    pass: `${process.env.EMAIL_PASSWORD}`,
  },
});

const registerEmail = async (userEmail, user) => {
  try {
    const emailToken = user.generateRegisterToken();
    let mailGenerator = new Mailgen({
      theme: 'default',
      product: {
        name: 'Flickbase',
        link: `${process.env.EMAIL_MAIN_URL}`,
      },
    });
    const email = {
      body: {
        name: userEmail,
        intro: 'Вітаємо в Flickbase! Ми дуже раді, що Ви приєдналися до нас.',
        action: {
          instructions:
            'Щоб підтвердити Ваш акаунт, натисніть, будь-ласка, тут:',
          button: {
            color: '#1a73e8',
            text: 'Підтвердити акаунт',
            link: `${process.env.SITE_DOMAIN}verification?t=${emailToken}`,
          },
        },
        outro:
          'Вам потрібна допомога чи у Вас виникли запитання? Просто напишіть нам у відповідь на цей лист, ми з радістю допоможемо Вам.',
      },
    };

    let emailBody = mailGenerator.generate(email);
    let message = {
      from: process.env.EMAIL,
      to: userEmail,
      subject: 'Вітаємо в Flickbase',
      html: emailBody,
    };
    await transporter.sendMail(message);
    return true;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  registerEmail,
};
