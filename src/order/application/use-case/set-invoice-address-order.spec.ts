import { NotFoundException } from '@nestjs/common';
import { SetInvoiceAddressOrderService } from '../use-case/set-invoice-address-order.service';
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

describe('SetInvoiceAddressOrderService', () => {
  let setInvoiceAddressOrderService: SetInvoiceAddressOrderService;
  let orderRepositoryFake: OrderRepositoryFake;

  beforeEach(() => {
    orderRepositoryFake = new OrderRepositoryFake();
    setInvoiceAddressOrderService = new SetInvoiceAddressOrderService(orderRepositoryFake as unknown as OrderRepositoryInterface);
  });

  it("devrait lancer NotFoundException si la commande n'existe pas", async () => {
    await expect(setInvoiceAddressOrderService.execute('id-inexistant', 'Nouvelle Adresse de Facturation')).rejects.toThrow(NotFoundException);
  });

  it('devrait définir une nouvelle adresse de facturation et sauvegarder la commande si elle existe', async () => {
    const orderMock = new Order({
      customerName: 'John Doe',
      items: [
        { productName: 'article 1', price: 10, quantity: 1 },
        { productName: 'article 2', price: 15, quantity: 1 },
      ],
      shippingAddress: '123 Rue de Livraison',
      invoiceAddress: 'Ancienne Adresse de Facturation',
    }); 

    orderMock.id = 'commande-id-123';
    orderRepositoryFake.orders[orderMock.id] = orderMock;
    orderMock.setStatus(OrderStatus.SHIPPING_ADDRESS_SET);
    const orderUpdated = await setInvoiceAddressOrderService.execute(orderMock.id, 'Nouvelle Adresse de Facturation');

    expect(orderUpdated).toBeDefined();
    expect(orderUpdated.invoiceAddress).toBe('Nouvelle Adresse de Facturation');
    expect(orderRepositoryFake.orders[orderMock.id].invoiceAddress).toBe('Nouvelle Adresse de Facturation');
  });
});
