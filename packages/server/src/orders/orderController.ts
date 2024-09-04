import {Controller, Get, Inject, Param} from "@nestjs/common";
import {ORDER_REPO} from "../adapters";
import {OrderRepository} from "../adapters/order.repo";

@Controller("/order")
export class OrderController {
    constructor(@Inject(ORDER_REPO) private orderRepo: OrderRepository) {
    }

    @Get("/:orderId")
    async getOrder(@Param("orderId") orderId: string) {
        return this.orderRepo.findById(orderId);
    }
}