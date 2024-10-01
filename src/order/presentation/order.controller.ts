import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  CreateOrderCommand,
  CreateOrderService,
} from 'src/order/domain/use-case/create-order.service';

@Controller('/orders')
export default class OrderController {
  constructor(private readonly createOrderService: CreateOrderService) {}

  @Post()
  async createOrder(
    @Body() createOrderCommand: CreateOrderCommand,
  ): Promise<string> {
    return this.createOrderService.createOrder(createOrderCommand);
  }

}
