
const nodemailer = require('nodemailer');
const sendToken = require("../utils/jwtToken");

const sendEmail = async (options) => {
    let testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        service: process.env.SMTP_SERVICE,
        auth: {
            // type:"OAuth2",
            user: process.env.SMTP_MAIL,
            pass: process.env.appPassword
            // accessToken: ,
        },

    });


    const mailOptions = {
        from: "sujan@gmail.com",
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    await transporter.sendMail(mailOptions);

}

module.exports = sendEmail;