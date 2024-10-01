import { OrderItem } from '../entity/order-item.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';
import { CreateOrderCommand, ItemDetailCommand } from '../use-case/create-order.service';
import { BadRequestException } from '@nestjs/common';

export enum OrderStatus {
  PENDING = 'PENDING',
  SHIPPING_ADDRESS_SET = 'SHIPPING_ADDRESS_SET',
  PAID = 'PAID',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELED = 'CANCELED',
}

@Entity()
export class Order {

  
  static MAX_ITEMS = 5;

  static AMOUNT_MINIMUM = 5;

  static AMOUNT_MAXIMUM = 500;

  static SHIPPING_COST = 5;

  @CreateDateColumn()
  @Expose({ groups: ['group_orders'] })
  createdAt: Date;

  @PrimaryGeneratedColumn()
  @Expose({ groups: ['group_orders'] })
  id: string;

  @Column({ nullable: true })
  @Expose({ groups: ['group_orders'] })
  price: number;

  @Column()
  @Expose({ groups: ['group_orders'] })
  customerName: string;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    nullable: true,
  })
  @Expose({ groups: ['group_orders'] })
  orderItems: OrderItem[];

  @Column({ nullable: true })
  @Expose({ groups: ['group_orders'] })
  shippingAddress: string | null;

  @Column({ nullable: true })
  @Expose({ groups: ['group_orders'] })
  invoiceAddress: string | null;

  @Column({ nullable: true })
  @Expose({ groups: ['group_orders'] })
  shippingAddressSetAt: Date | null;

  @Column()
  @Expose({ groups: ['group_orders'] })
  private status: string;

  @Column({ nullable: true })
  @Expose({ groups: ['group_orders'] })
  private paidAt: Date | null;

  @Column({ nullable: true })
  @Expose({ groups: ['group_orders'] })
  private canceledAt: Date | null;

  @Column({ nullable: true })
  @Expose({ groups: ['group_orders'] })
  private cancelReason: string | null;


  constructor(createOrderCommand: CreateOrderCommand) {
    const { items, customerName, shippingAddress, invoiceAddress } = createOrderCommand;
    if (
      !customerName ||
      !items ||
      items.length === 0 ||
      !shippingAddress ||
      !invoiceAddress
    ) {
      throw new BadRequestException('Missing required fields');
    }

    if (items.length > Order.MAX_ITEMS) {
      throw new BadRequestException(
        'Cannot create order with more than 5 items',
      );
    }

    const totalAmount = this.calculateOrderAmount(items);

    this.customerName = customerName;
    this.shippingAddress = shippingAddress;
    this.invoiceAddress = invoiceAddress;
    this.price = totalAmount;
    this.orderItems = items.map(item => new OrderItem());
    this.createdAt = new Date();
    this.status = OrderStatus.PENDING;

  }

  calculateOrderAmount(items: ItemDetailCommand[]): number {
    const totalAmount = items.reduce((sum, item) => sum + item.price, 0);

    if (totalAmount < Order.AMOUNT_MINIMUM) {
      throw new BadRequestException(
        `Cannot create order with total amount less than ${Order.AMOUNT_MINIMUM}€`,
      );
    }

    return totalAmount;
  }

  pay(): void {
    if (this.status !== OrderStatus.PENDING) {
      throw new Error('Commande déjà payée');
    }

    if (this.price > Order.AMOUNT_MAXIMUM) {
      throw new Error('Montant maximum dépassé');
    }

    this.status = OrderStatus.PAID;
    this.paidAt = new Date();
  }

  setShippingAddress(customerAddress: string): void {
    if (
      this.status !== OrderStatus.PENDING &&
      this.status !== OrderStatus.SHIPPING_ADDRESS_SET
    ) {
      throw new Error('Commande non payée');
    }
    if (this.orderItems.length < Order.MAX_ITEMS) {
      throw new Error('Moins de 3 articles');
    }
    this.status = OrderStatus.SHIPPING_ADDRESS_SET;
    this.shippingAddressSetAt = new Date();
    this.shippingAddress = customerAddress;
    this.price += Order.SHIPPING_COST;
  }

  setBillingAddress(billingAddress: string): void {
    if(this.shippingAddress === null){
      throw new Error('Adresse de livraison non rensegnée');
    }
    if(billingAddress === null || billingAddress === ''){
      this.invoiceAddress = this.shippingAddress;
    }
    this.invoiceAddress = billingAddress;
  }
  
  cancel(cancelReason : string): void {
    if(this.status === OrderStatus.SHIPPED){
      throw new Error('Commande déjà envoyée');
    }
    this.status = OrderStatus.CANCELED;
    this.canceledAt = new Date();
    this.cancelReason = cancelReason;
  }
}