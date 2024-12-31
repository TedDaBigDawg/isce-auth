import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { NotFoundError } from 'rxjs';

@Injectable()
export class MailService {
  private transporter: { sendMail: (arg0: { from: string; to: string; subject: string; text: string; html: string; }) => any; };

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail', // Or use SMTP server details
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendResetPasswordEmail(to: string, resetCode: string) {
    try {
        console.log(process.env.EMAIL_PASS);
        if (!resetCode) {
            throw new NotFoundException("Invalid Request");
        }
        // const resetLink = `http://localhost:3000/reset-password?code=${resetCode}`;
        const mailOptions = {
        from: '"WALLET" osiobeted@gmail.com',
        to,
        subject: 'Reset Your Password',
        text: `Here is your Reset Code: ${resetCode}`,
        html: `<p>Here is your Reset Code ${resetCode} to reset your password.</p>`,
        };
        return await this.transporter.sendMail(mailOptions);
        
    } catch (error) {
        throw new HttpException(error.message || 'Invalid code or request', HttpStatus.BAD_REQUEST);
    }
    
  }
}
