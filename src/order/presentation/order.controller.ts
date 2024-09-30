import { Body, Controller, Param, Post } from '@nestjs/common';
import { CreateOrderService } from '../domain/use-case/create-order.service';


@Controller('/orders')
export default class OrderController {
  constructor(private readonly createOrderService: CreateOrderService) {} 

  @Post('/create')
  async createOrder(@Body() body: any){
    return this.createOrderService.createOrder(body);
  }
  
  @Post('/pay/:id')
  async payOrder(@Param('id') id: string) {
    return this.createOrderService.payOrder(id);
  }
}

