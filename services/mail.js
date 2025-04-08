import nodemailer from "nodemailer";
import { EMAIL_PASS, EMAIL } from "../config/index.js";
import { logger as log } from "./logger.service.js";

const logger = log('mail')

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

export const sendEmail = async (toEmail, subject, htmlContent) => {
  const mailOptions = {
    from: `A2K Group <${EMAIL}>`,
    to: toEmail,
    subject: subject,
    html: htmlContent,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        logger.error(`Unable to send email: ${error.message}`)
        reject(new Error(`Unable to send email: ${error.message}`));
      } else {
        logger.info("Email sent: ", info.response)
        console.log("Email sent: ", info.response);
        resolve(info.response);
      }
    });
  });
};



export const sendLogs = async (subject, text, logs) => {
  const mailOptions = {
    from: `A2K Group <${EMAIL}>`,
    to: EMAIL,
    subject: subject,
    text: text,
    attachments: logs
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        logger.error(`Unable to send email: ${error.message}`)
        reject(new Error(`Unable to send email: ${error.message}`));
      } else {
        logger.info("Email sent: ", info.response)
        console.log("Email sent: ", info.response);
        resolve(info.response);
      }
    });
  });
};
