import { CreateOrderService } from '../use-case/create-order.service';
import { OrderRepositoryInterface } from '../../domain/port/persistance/order.repository.interface';
import { Order } from '../../domain/entity/order.entity';

class OrderRepositoryFake {
  async save(order: Order): Promise<Order> {
    return order;
  }
}

const orderRepositoryFake =
  new OrderRepositoryFake() as OrderRepositoryInterface;

describe("an order can't be created if the order have more than 5 item", () => {
  it('should return an error', async () => {
    const createOrderService = new CreateOrderService(orderRepositoryFake);

    await expect(
      createOrderService.execute({
        customerName: 'John Doe',
        items: [
          { productName: 'item 1', price: 10, quantity: 1 },
          { productName: 'item 2', price: 10, quantity: 1 },
          { productName: 'item 3', price: 10, quantity: 1 },
          { productName: 'item 4', price: 10, quantity: 1 },
          { productName: 'item 5', price: 10, quantity: 1 },
          { productName: 'item 6', price: 10, quantity: 1 },
        ],
        shippingAddress: 'Shipping Address',
        invoiceAddress: 'Invoice Address',
      }),
    ).rejects.toThrow();
  });
});

describe("an order can't be created if the customer name is missing", () => {
  it('should return an error', async () => {
    const createOrderService = new CreateOrderService(orderRepositoryFake);

    await expect(
      createOrderService.execute({
        customerName: '',
        items: [
          { productName: 'item 1', price: 10, quantity: 1 },
          { productName: 'item 2', price: 10, quantity: 1 },
          { productName: 'item 3', price: 10, quantity: 1 },
          { productName: 'item 4', price: 10, quantity: 1 },
          { productName: 'item 5', price: 10, quantity: 1 },
        ],
        shippingAddress: 'Shipping Address',
        invoiceAddress: 'Invoice Address',
      }),
    ).rejects.toThrow();
  });
});

describe("an order can't be created if items is null", () => {
  it('should return an error', async () => {
    const createOrderService = new CreateOrderService(orderRepositoryFake);

    await expect(
      createOrderService.execute({
        customerName: 'John Doe',
        items: null,
        shippingAddress: 'Shipping Address',
        invoiceAddress: 'Invoice Address',
      }),
    ).rejects.toThrow();
  });
});

describe("an order can't be created if there are no items", () => {
  it('should return an error', async () => {
    const createOrderService = new CreateOrderService(orderRepositoryFake);

    await expect(
      createOrderService.execute({
        customerName: 'John Doe',
        items: [],
        shippingAddress: 'Shipping Address',
        invoiceAddress: 'Invoice Address',
      }),
    ).rejects.toThrow();
  });
});

describe("an order can't be created if the shipping address is missing", () => {
  it('should return an error', async () => {
    const createOrderService = new CreateOrderService(orderRepositoryFake);

    await expect(
      createOrderService.execute({
        customerName: 'John Doe',
        items: [
          { productName: 'item 1', price: 10, quantity: 1 },
          { productName: 'item 2', price: 10, quantity: 1 },
          { productName: 'item 3', price: 10, quantity: 1 },
          { productName: 'item 4', price: 10, quantity: 1 },
          { productName: 'item 5', price: 10, quantity: 1 },
        ],
        shippingAddress: '',
        invoiceAddress: 'Invoice Address',
      }),
    ).rejects.toThrow();
  });
});

describe("an order can't be created if the invoice address is missing", () => {
  it('should return an error', async () => {
    const createOrderService = new CreateOrderService(orderRepositoryFake);

    await expect(
      createOrderService.execute({
        customerName: 'John Doe',
        items: [
          { productName: 'item 1', price: 10, quantity: 1 },
          { productName: 'item 2', price: 10, quantity: 1 },
          { productName: 'item 3', price: 10, quantity: 1 },
          { productName: 'item 4', price: 10, quantity: 1 },
          { productName: 'item 5', price: 10, quantity: 1 },
        ],
        shippingAddress: 'Shipping Address',
        invoiceAddress: '',
      }),
    ).rejects.toThrow();
  });
});
