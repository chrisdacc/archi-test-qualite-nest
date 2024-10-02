import * as twilio from 'twilio';
import { Order } from 'src/order/domain/entity/order.entity';
import { Injectable } from '@nestjs/common';
@Injectable()
export class SmsService{
    const accountSid = 'your_twilio_account_sid';
    const authToken = 'your_twilio_auth_token';
    const client = twilio(this.accountSid, this.authToken);
    async sendSms(order : Order) {
        await this.client.messages.create({
            body: `Votre commande numéro ${order.id} a été confirmée.`,
            from: '+1234567890',
            to: order.customerPhoneNumber,
          });
    }
    

    await this.orderRepository.save(order);
}