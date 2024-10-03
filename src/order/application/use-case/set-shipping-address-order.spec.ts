import { NotFoundException } from '@nestjs/common';
import { SetShippingAddressOrderService } from '../use-case/set-shipping-address-order.service';
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

describe('SetShippingAddressOrderService', () => {
  let setShippingAddressOrderService: SetShippingAddressOrderService;
  let orderRepositoryFake: OrderRepositoryFake;

  beforeEach(() => {
    orderRepositoryFake = new OrderRepositoryFake();
    setShippingAddressOrderService = new SetShippingAddressOrderService(orderRepositoryFake as unknown as OrderRepositoryInterface);
  });

  it("devrait lancer NotFoundException si la commande n'existe pas", async () => {
    await expect(setShippingAddressOrderService.execute('id-inexistant', '123 Rue Nouvelle')).rejects.toThrow(NotFoundException);
  });

  it('devrait définir une adresse de livraison pour une commande en attente', async () => {
    const orderMock = new Order({
      customerName: 'John Doe',
      items: [
        { productName: 'article 1', price: 50, quantity: 1 },
      ],
      shippingAddress: '',
      invoiceAddress: 'Adresse de Facturation',
    });

    orderMock.id = 'commande-id-123';
    orderMock.setStatus(OrderStatus.PENDING);
    orderMock.price = 50;
    orderRepositoryFake.orders[orderMock.id] = orderMock;

    const updatedOrder = await setShippingAddressOrderService.execute(orderMock.id, '123 Rue Nouvelle');

    expect(updatedOrder.shippingAddress).toBe('123 Rue Nouvelle');
    expect(updatedOrder.getStatus()).toBe(OrderStatus.SHIPPING_ADDRESS_SET);
    expect(updatedOrder.shippingAddressSetAt).toBeInstanceOf(Date);
    expect(updatedOrder.price).toBe(50 + Order.SHIPPING_COST);
  });

  it("devrait lancer une erreur si la commande n'est pas en attente ou l'adresse de livraison déjà définie", async () => {
    const orderMock = new Order({
      customerName: 'John Doe',
      items: [
        { productName: 'article 1', price: 50, quantity: 1 },
      ],
      shippingAddress: '',
      invoiceAddress: 'Adresse de Facturation',
    });

    orderMock.id = 'commande-id-124';
    orderMock.setStatus(OrderStatus.PAID); 
    orderRepositoryFake.orders[orderMock.id] = orderMock;

    await expect(setShippingAddressOrderService.execute(orderMock.id, '123 Rue Nouvelle')).rejects.toThrow('Commande non payée');
  });

  it("devrait lancer une erreur s'il y a trop d'articles dans la commande", async () => {
    const orderMock = new Order({
      customerName: 'John Doe',
      items: Array(Order.MAX_ITEMS).fill({ productName: 'article', price: 10, quantity: 1 }),
      shippingAddress: '',
      invoiceAddress: 'Adresse de Facturation',
    });

    orderMock.id = 'commande-id-123';
    orderMock.setStatus(OrderStatus.PENDING);
    orderRepositoryFake.orders[orderMock.id] = orderMock;

    await expect(setShippingAddressOrderService.execute(orderMock.id, '123 Rue Nouvelle')).rejects.toThrow('Trop d’articles');
  });
});
