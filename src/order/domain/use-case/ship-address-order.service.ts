import OrderRepository from "src/order/infrastructure/order.repository";
import { Order } from "../entity/order.entity";
import { NotFoundException } from "@nestjs/common";

export class ShipAddressOrderService{
    constructor(private readonly orderRepository: OrderRepository){}

    public async shipAddressOrder(orderId: string) : Promise<Order> {
        const order = await this.orderRepository.findById(orderId);

        if(!order){
            throw new NotFoundException('Pas de commande');
        }

        order.setShippingAddress("20 rue Brian");

        return this.orderRepository.save(order);
    }
}