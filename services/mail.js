import nodemailer from 'nodemailer';
import { EMAIL_PASS, EMAIL } from '../config/index.js'

export const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: EMAIL,
        pass: EMAIL_PASS,
    },
});



export const sendEmail = async (toEmail, subject, text) => {
    const mailOptions = {
        from: `A2K Group <${EMAIL}>`,
        to: toEmail,
        subject: subject,
        text: text
    }

    return new Promise((resolve, reject) => { // Added promise wrapper
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(new Error(`Unable to send email: ${error.message}`));
            } else {
                console.log("Email sent: ", info.response);
                resolve(info.response);
            }
        });
    });
}