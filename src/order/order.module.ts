import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import OrderController from './presentation/order.controller';
import { Order } from './domain/entity/order.entity';
import { OrderItem } from './domain/entity/order-item.entity';
import { CreateOrderService } from 'src/order/domain/use-case/create-order.service';
import { OrderRepositoryInterface } from 'src/order/domain/port/order.repository.interface';
import OrderRepositoryTypeOrm from 'src/order/infrastructure/order.repository';
import { PayOrderService } from 'src/order/domain/use-case/pay-order.service';
import { CancelOrderService } from 'src/order/domain/use-case/cancel-order.service';
import { SetInvoiceAddressOrderService } from 'src/order/domain/use-case/set-invoice-address-order.service';
import { SetShippingAddressOrderService } from 'src/order/domain/use-case/set-shipping-address-order.service';
import { GeneratePDFOrderService } from './domain/use-case/generate-pdf-order.service';
import { PdfGeneratorInterface } from './domain/port/pdf-generator.interface';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem])],
  controllers: [OrderController],

  providers: [
    // j'enregistre mon repository en tant que service
    OrderRepositoryTypeOrm,


    

    {
      provide: CreateOrderService,
      useFactory: (orderRepository: OrderRepositoryInterface) => {
        return new CreateOrderService(orderRepository);
      },
      inject: [OrderRepositoryTypeOrm],
    },{
      provide: PayOrderService,
      useFactory: (orderRepository: OrderRepositoryInterface) => {
        return new PayOrderService(orderRepository);
      },
      inject: [OrderRepositoryTypeOrm],
    },{
      provide: CancelOrderService,
      useFactory: (orderRepository: OrderRepositoryInterface) => {
        return new CancelOrderService(orderRepository);
      },
      inject: [OrderRepositoryTypeOrm],
    },{
      provide: SetInvoiceAddressOrderService,
      useFactory: (orderRepository: OrderRepositoryInterface) => {
        return new SetInvoiceAddressOrderService(orderRepository);
      },
      inject: [OrderRepositoryTypeOrm],
    },{
      provide: SetShippingAddressOrderService,
      useFactory: (orderRepository: OrderRepositoryInterface) => {
        return new SetShippingAddressOrderService(orderRepository);
      },
      inject: [OrderRepositoryTypeOrm],
    },
    {
      provide: GeneratePDFOrderService,
      useFactory: (orderRepository: OrderRepositoryInterface, pdfGenerator : PdfGeneratorInterface) => {
        return new GeneratePDFOrderService(orderRepository, pdfGenerator);
      },
      inject: [OrderRepositoryTypeOrm],
    }
  ],
})
export class OrderModule {}