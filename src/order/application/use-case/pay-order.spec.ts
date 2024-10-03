import { NotFoundException } from '@nestjs/common';
import { PayOrderService } from '../use-case/pay-order.service';
import { Order, OrderStatus } from '../../domain/entity/order.entity';
import { OrderRepositoryInterface } from '../../domain/port/persistance/order.repository.interface';

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

describe('PayOrderService', () => {
  let payOrderService: PayOrderService;
  let orderRepositoryFake: OrderRepositoryFake;

  beforeEach(() => {
    orderRepositoryFake = new OrderRepositoryFake();
    payOrderService = new PayOrderService(orderRepositoryFake as unknown as OrderRepositoryInterface);
  });

  it("devrait lancer NotFoundException si la commande n'existe pas", async () => {
    await expect(payOrderService.execute('id-inexistant')).rejects.toThrow(NotFoundException);
  });

  it('devrait payer la commande si elle est en attente et sauvegarder la commande', async () => {
    const orderMock = new Order({
      customerName: 'John Doe',
      items: [
        { productName: 'article 1', price: 50, quantity: 1 },
        { productName: 'article 2', price: 100, quantity: 1 },
      ],
      shippingAddress: '123 Rue de Livraison',
      invoiceAddress: 'Adresse de Facturation',
    });

    orderMock.id = 'commande-id-123';
    orderMock.setStatus(OrderStatus.PENDING);
    orderMock.price = 150;
    orderRepositoryFake.orders[orderMock.id] = orderMock;

    const orderPaid = await payOrderService.execute(orderMock.id);

    expect(orderPaid).toBeDefined();
    expect(orderPaid.getStatus()).toBe(OrderStatus.PAID);
  });

  it("devrait lancer une erreur si la commande est déjà payée", async () => {
    const orderMock = new Order({
      customerName: 'John Doe',
      items: [
        { productName: 'article 1', price: 50, quantity: 1 },
      ],
      shippingAddress: '123 Rue de Livraison',
      invoiceAddress: 'Adresse de Facturation',
    });

    orderMock.id = 'commande-id-124';
    orderMock.setStatus(OrderStatus.PAID);
    orderMock.price = 50;
    orderRepositoryFake.orders[orderMock.id] = orderMock;

    await expect(payOrderService.execute(orderMock.id)).rejects.toThrow('Commande déjà payée');
  });

  it("devrait lancer une erreur si le montant maximum est dépassé", async () => {
    const orderMock = new Order({
      customerName: 'John Doe',
      items: [
        { productName: 'article 1', price: 5000, quantity: 1 },
      ],
      shippingAddress: '123 Rue de Livraison',
      invoiceAddress: 'Adresse de Facturation',
    });

    orderMock.id = 'commande-id-125';
    orderMock.setStatus(OrderStatus.PENDING);
    orderMock.price = 10000; 
    orderRepositoryFake.orders[orderMock.id] = orderMock;

    await expect(payOrderService.execute(orderMock.id)).rejects.toThrow('Montant maximum dépassé');
  });
});
