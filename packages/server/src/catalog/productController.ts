import {Body, Controller, Get, Inject, Post, Query, UsePipes} from "@nestjs/common";
import {PRODUCT_REPO} from "../adapters";
import {ProductRepository} from "../adapters/product.repo";
import {ZodValidationPipe} from "../zodValidationPipe";
import {ProductTemplate} from "../types";

@Controller("/products")
export class ProductController {
    constructor(@Inject(PRODUCT_REPO) private productRepo: ProductRepository) {
    }

    @Post()
    @UsePipes(new ZodValidationPipe(ProductTemplate))
    async createProduct(@Body() product: ProductTemplate) {
        return this.productRepo.create(product);
    }

    @Get()
    async getProducts() {
        return this.productRepo.findAll();
    }

    @Get("/search")
    async searchProducts(@Query("query") query: string) {
        return this.productRepo.findByTitle(query);
    }
}