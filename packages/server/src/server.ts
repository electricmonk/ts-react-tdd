import {ProductTemplate} from "./types";
import {Test} from "@nestjs/testing";
import {InMemoryOrderRepository, InMemoryProductRepository} from "./adapters/fake";
import {AppModule} from "./app.module";
export async function createTestingModule(products: ProductTemplate[] = []) {
    const productRepo = new InMemoryProductRepository(products);
    const orderRepo = new InMemoryOrderRepository();
    const testingModule = await Test.createTestingModule({
        imports: [AppModule.register(productRepo, orderRepo)],
    })
        .compile();

    const nest = testingModule.createNestApplication();
    nest.enableCors({origin: "*"});
    await nest.init();
    return {nest, orderRepo, productRepo};
}