import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller('/orders')
export default class OrderController {
  @Post('/create')
  async createOrder(@Body() body: any) {
    const { items, customerName, shippingAddress, invoiceAddress } = body;

    if (!customerName || !items || !shippingAddress || !invoiceAddress) {
      return 'Missing required fields';
    }

    if (items.length === 0) {
      return 'Order must contain at least one item';
    }

    if (items.length > 5) {
      return 'Order cannot contain more than 5 items';
    }

    const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

    if (totalPrice < 10) {
      return 'Order total must be at least 10e';
    }

    return 'OK';
  }
}
