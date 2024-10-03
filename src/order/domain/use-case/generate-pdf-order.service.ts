import { NotFoundException } from "@nestjs/common";
import { OrderRepositoryInterface } from "../port/order.repository.interface";
import { Order } from "../entity/order.entity";
import { PdfGeneratorInterface } from "../port/pdf-generator.interface";

export class GeneratePDFOrderService{
    constructor(private readonly orderRepository: OrderRepositoryInterface,     
        private readonly pdfGenerator: PdfGeneratorInterface,
    ) {}

    async execute(orderId : string): Promise<void>{
        const order = await this.orderRepository.findById(orderId);
        let details = orderId;

        if(!order){
            throw new NotFoundException('Pas de commande');
        }

        details = details.concat(order.getDetails());

        return this.pdfGenerator.generateInvoicePdf(details);
    }
}