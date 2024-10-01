import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Order } from 'src/order/domain/entity/order.entity';
import {
  CreateOrderCommand,
  CreateOrderService,
} from 'src/order/domain/use-case/create-order.service';
import { PayOrderService } from 'src/order/domain/use-case/pay-order.service';
import { SetShippingAddressOrderService } from 'src/order/domain/use-case/ship-address-order.service';
import { CancelOrderService } from '../domain/use-case/cancel-order.service';
import { SetBillingAddressOrderService } from '../domain/use-case/billing-address-order.service';
@Controller('/orders')
export default class OrderController {
  constructor(
    private readonly createOrderService: CreateOrderService,
    private readonly payOrderService: PayOrderService,
    private readonly cancelOrderService: CancelOrderService,
    private readonly setBillingAddressOrderService: SetBillingAddressOrderService
  ) {}

  @Post()
  async createOrder(
    @Body() createOrderCommand: CreateOrderCommand,
  ) {
    return this.createOrderService.createOrder(createOrderCommand);
  }

  @Post()
  async payOrder(@Param('id') id: string): Promise<Order> {
    return await this.payOrderService.execute(id);
  }

  @Post()
  async cancelOrder(@Param('id') id: string, @Body() req : string): Promise<Order> {
    return await this.cancelOrderService.execute(id, req);
  }

  @Post()
  async setBillingAddress(@Param('id') id: string, @Body() req : string): Promise<Order> {
    return await this.setBillingAddressOrderService.execute(id, req);
  }

}