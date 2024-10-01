import OrderRepository from "src/order/infrastructure/order.repository";
import { Order } from "../entity/order.entity";
import { NotFoundException } from "@nestjs/common";

export class CancelOrderService {
    constructor(private readonly orderRepository: OrderRepository){}

    public async execute(orderId: string, cancelReason : string): Promise<Order> {
        const order = await this.orderRepository.findById(orderId);

        if(!order){
            throw new NotFoundException('Pas de commande');
        }

        order.cancel(cancelReason);

        return this.orderRepository.save(order);
    }

}