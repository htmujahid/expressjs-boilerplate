const nodemailer = require('nodemailer');
const logger = require('../config/logger');
require('dotenv').config();

const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
    },
});
/* istanbul ignore next */
if (process.env.NODE_ENV !== 'test') {
    transport
        .verify()
        .then(() => logger.info('Connected to email server'))
        .catch(() =>
            logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'),
        );
}

const sendEmail = async (to, subject, html) => {
    const msg = { from: process.env.EMAIL_FROM, to, subject, html };
    await transport.sendMail(msg);
};

const sendResetPasswordEmail = async (to, token) => {
    const subject = 'Reset password';
    // replace this url with the link to the reset password page of your front-end app
    const resetPasswordUrl = `${process.env.APP_URL}/reset-password?token=${token}`;
    const html = `Dear user,
To reset your password, click on this link: <a href=${resetPasswordUrl}>Reset Password</a>
If you did not request any password resets, then ignore this email.`;
    await sendEmail(to, subject, html);
};

const sendVerificationEmail = async (to, token) => {
    const subject = 'Email Verification';
    // replace this url with the link to the email verification page of your front-end app
    const verificationEmailUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
    const html = `Dear user,
To verify your email, click on this link: <a  href=${verificationEmailUrl}>Verify Email</a>
If you did not create an account, then ignore this email.`;
    await sendEmail(to, subject, html);
};

module.exports = {
    transport,
    sendEmail,
    sendResetPasswordEmail,
    sendVerificationEmail,
};
