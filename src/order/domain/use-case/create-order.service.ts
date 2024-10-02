import {
  CreateOrderCommand,
  Order,
} from 'src/order/domain/entity/order.entity';
import OrderRepository from 'src/order/infrastructure/order.repository';
import { OrderRepositoryInterface } from '../port/order.repository.interface';

export class CreateOrderService {
  constructor(private readonly orderRepository: OrderRepositoryInterface) {}

  async execute(createOrderCommand: CreateOrderCommand): Promise<Order> {
    const order = new Order(createOrderCommand);

    return await this.orderRepository.save(order);
  }
}