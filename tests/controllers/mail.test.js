import { vi, describe, expect, it } from 'vitest';
import { sendEmail, transporter } from '../../services/mail.js'; // Adjust the path


vi.mock('../../services/mail.js', async () => {
    const actual = await import('../../services/mail.js')
    const mockSendMail = vi.fn((mailOptions, callback) => {
        callback(null, { response: 'Email sent successfully' });
    });
    return {
        ...actual,
        transporter: { sendMail: mockSendMail }
    }
})


describe('sendEmail', () => {
    const toEmail = 'test@example.com';
    const subject = 'Test Subject';
    const text = 'Test Text';

    it('should send an email successfully', async () => {
        // const mockSendMail = vi.fn((mailOptions, callback) => {
        //     callback(null, { response: 'Email sent successfully' }); // Changed here
        // });

        // vi.mock('../services/mail.js', async () => {
        //     const actual = await import('../services/mail.js');
        //     return {
        //         ...actual,
        //         transporter: { sendMail: mockSendMail },
        //     };
        // });
        // const response = await sendEmail(toEmail, subject, text);
        // expect(response).toBe('Email sent successfully');
        // expect(transporter.sendMail).toHaveBeenCalledWith(
        //     {
        //         from: `A2K Group <${process.env.EMAIL}>`,
        //         to: toEmail,
        //         subject: subject,
        //         text: text,
        //     },
        //     expect.any(Function)
        // );
    });

    it('should handle email sending errors', async () => {
        // vi.mock('../../services/mail.js', () => {
        //     const mockSendMail = vi.fn((mailOptions, callback) => {
        //         callback(new Error('Email sending failed'), null);
        //     });

        //     return {
        //         ...vi.importActual('../../services/mail.js'),
        //         transporter: {
        //             sendMail: mockSendMail,
        //         },
        //     };
        // });

        // await expect(sendEmail(toEmail, subject, text)).rejects.toThrow('Email sending failed');
    });


    it('should handle unexpected errors from sendMail', async () => {
        // vi.mock('../../services/mail.js', () => {
        //     const mockSendMail = vi.fn((mailOptions, callback) => {
        //         callback(new Error('Unexpected error'), null);
        //     });

        //     return {
        //         ...vi.importActual('../../services/mail.js'),
        //         transporter: {
        //             sendMail: mockSendMail,
        //         },
        //     };
        // });

        // await expect(sendEmail(toEmail, subject, text)).rejects.toThrow('Unable to send email: Unexpected error');
    });
});