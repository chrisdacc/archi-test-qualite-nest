import { Injectable } from '@nestjs/common';
import { Order } from 'src/order/domain/entity/order.entity';

@Injectable()
export class OrderValidationService {
  validate(order: Order): boolean {
    return order.isValid();
  }
}
