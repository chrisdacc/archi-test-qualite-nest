import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import OrderController from './presentation/order.controller';
import { Order } from './domain/entity/order.entity';
import { OrderItem } from './domain/entity/order-item.entity';
import { CreateOrderService } from 'src/order/domain/use-case/create-order.service';
import { PayOrderService } from './domain/use-case/pay-order.service';
import { CancelOrderService } from './domain/use-case/cancel-order.service';
import { SetBillingAddressOrderService } from './domain/use-case/billing-address-order.service';
@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem])],
  controllers: [OrderController],
  providers: [CreateOrderService, PayOrderService, CancelOrderService, SetBillingAddressOrderService],
})
export class OrderModule {}
