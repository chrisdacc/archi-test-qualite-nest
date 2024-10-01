import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import OrderController from './presentation/order.controller';
import { Order } from './domain/entity/order.entity';
import { OrderItem } from './domain/entity/order-item.entity';
import { CreateOrderService } from 'src/order/domain/use-case/create-order.service';
import { PayOrderService } from './domain/use-case/pay-order.service';
import { ShipAddressOrderService } from './domain/use-case/ship-address-order.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem])],
  controllers: [OrderController],
  providers: [CreateOrderService, PayOrderService, ShipAddressOrderService],
})
export class OrderModule {}
