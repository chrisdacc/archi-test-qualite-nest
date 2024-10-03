import { CancelOrderService } from '../use-case/cancel-order.service';
import { Order, OrderStatus } from '../../domain/entity/order.entity';
import { OrderRepositoryInterface } from 'src/order/domain/port/persistance/order.repository.interface';


class OrderRepositoryFake {
  orders: { [key: string]: Order } = {};

  async findById(orderId: string): Promise<Order | null> {
    return this.orders[orderId] || null;
  }

  async save(order: Order): Promise<Order> {
    this.orders[order.id] = order;
    return order;
  }
}

const orderRepositoryFake = new OrderRepositoryFake();

const mockOrder = new Order({
  customerName: 'John Doe',
  items: [
    { productName: 'item 1', price: 10, quantity: 1 },
    { productName: 'item 2', price: 10, quantity: 1 },
    { productName: 'item 3', price: 10, quantity: 1 },
    { productName: 'item 4', price: 10, quantity: 1 },
    { productName: 'item 5', price: 10, quantity: 1 },
  ],
  shippingAddress: 'Shipping Address',
  invoiceAddress: 'Invoice Address',
});


mockOrder.setStatus(OrderStatus.PENDING);
orderRepositoryFake.orders['1'] = mockOrder;


const orderRepository = orderRepositoryFake as unknown as OrderRepositoryInterface;


describe('CancelOrderService Tests', () => {

  it("should return an error if the order ID is null", async () => {
    const cancelOrderService = new CancelOrderService(orderRepository);
    await expect(cancelOrderService.execute(null, 'reason')).rejects.toThrow();
  });

  it("should return an error if the order doesn't exist", async () => {
    const cancelOrderService = new CancelOrderService(orderRepository);
    await expect(cancelOrderService.execute('x', 'reason')).rejects.toThrow();
  });



});
