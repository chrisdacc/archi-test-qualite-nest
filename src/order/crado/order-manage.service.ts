import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as nodemailer from 'nodemailer';
import * as twilio from 'twilio';
import { Order } from 'src/order/domain/entity/order.entity';
import { EmailService } from './email.service';
import { SmsService } from './sms.service';
import { OrderValidationService } from './order-validation.service';

@Injectable()
export class OrderManagerService {
    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
        private readonly orderValidationService: OrderValidationService,
        private readonly emailService: EmailService,
        private readonly smsService: SmsService,
      ) {}

  async processOrder(orderId: number): Promise<void> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new Error(`Order with ID ${orderId} not found`);
    }

    const isValid = this.orderValidationService.validate(order);
    if (!isValid) {
      throw new Error('Order validation failed');
    }
    await this.emailService.sendEmail(order);
    await this.smsService.sendSms(order);

    
   

    
  }
}