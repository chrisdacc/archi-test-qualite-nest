import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Order } from '../entity/order.entity';

interface ItemDetail {
    productName: string;
    price: number;
  }

@Injectable()
export class CreateOrderService {
    private orders = [
        { id: '1', customerName: 'Christian DACCACHE', status: 'En cours', paidAt: null, price: 50 },
        { id: '2', customerName: 'Christian DACCACHE', status: 'En cours', paidAt: null, price: 20 },
        ]
  createOrder(orderData: any): string {
    const { items, customerName, shippingAddress, invoiceAddress } = orderData;

    if (
      !customerName ||
      !items ||
      items.length === 0 ||
      !shippingAddress ||
      !invoiceAddress
    ) {
      throw new BadRequestException('Missing required fields');
    }

    if (items.length > Order.MAX_ITEMS) {
      throw new BadRequestException(
        'Cannot create order with more than 5 items',
      );
    }

    const totalAmount = this.calculateOrderAmount(items);

    return 'OK';
  }

  private calculateOrderAmount(items: ItemDetail[]): number {
    const totalAmount = items.reduce((sum, item) => sum + item.price, 0);

    if (totalAmount < Order.AMOUNT_MINIMUM) {
      throw new BadRequestException(
        'Cannot create order with total amount less than 10€',
      );
    }

    return totalAmount;
  }
  payOrder(orderId: string): any {
    
    const order = this.orders.find(o => o.id === orderId);

    if (!order) {
      throw new NotFoundException('Commande non trouvée');
    }

    if (order.status === 'payé') {
      throw new BadRequestException('Déjà payé');
    }

    order.status = 'payé';
    order.paidAt = new Date();

    return {
      message: 'payé',
      order,
    }
}
}
