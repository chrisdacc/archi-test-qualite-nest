import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Order } from 'src/order/domain/entity/order.entity';


@Injectable()
export class EmailService {
    private transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'your-email@gmail.com',
          pass: 'your-email-password',
        },
      });
    async sendEmail(order : Order){
        const mailOptions = {
            from: 'your-email@gmail.com',
            to: order.customerEmail,
            subject: 'Confirmation de commande',
            text: `Votre commande numéro ${order.id} a été confirmée.`,
        };

    }
    

    await transporter.sendMail(mailOptions);
}