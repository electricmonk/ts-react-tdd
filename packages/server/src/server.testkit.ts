import {ProductTemplate} from "./types";
import {Test} from "@nestjs/testing";
import {InMemoryOrderRepository, InMemoryProductRepository} from "./adapters/fake";
import {AppModuleInversionOfControl} from "./app.module.ioc";
import {AppModuleOverrides} from "./app.module.overrides";
import {ORDER_REPO, PRODUCT_REPO} from "./adapters";
import {MongoDBModule} from "./adapters/mongodb.module";
import {Module} from "@nestjs/common";
import {AppModuleWithRegister} from "./app.module.register";
import {MemoryModule} from "./adapters/memory.module";
export async function createTestingModuleWithIoC(products: ProductTemplate[] = []) {
    const productRepo = new InMemoryProductRepository(products);
    const orderRepo = new InMemoryOrderRepository();
    const testingModule = await Test.createTestingModule({
        imports: [AppModuleInversionOfControl.register(productRepo, orderRepo)],
    })
        .compile();

    const nest = testingModule.createNestApplication();
    nest.enableCors({origin: "*"});
    await nest.init();
    return {nest, orderRepo, productRepo};
}

export async function createTestingModuleWithOverrides(products: ProductTemplate[] = []) {
    const productRepo = new InMemoryProductRepository(products);
    const orderRepo = new InMemoryOrderRepository();
    const testingModule = await Test.createTestingModule({
        imports: [AppModuleOverrides],
    })
        .overrideModule(MongoDBModule).useModule(NopModule) // this doesn't actually do anything, MongoDB needs to be available for connection even though we don't use it
        .overrideProvider(PRODUCT_REPO).useValue(productRepo)
        .overrideProvider(ORDER_REPO).useValue(orderRepo)
        .compile();

    const nest = testingModule.createNestApplication();
    nest.enableCors({origin: "*"});
    await nest.init();
    return {nest, orderRepo, productRepo};
}

export async function createTestingModuleWithRegister(products: ProductTemplate[] = []) {

    const testingModule = await Test.createTestingModule({
        imports: [AppModuleWithRegister.register(MemoryModule.forTests(products))],
    })
        .compile();

    const productRepo: InMemoryProductRepository = testingModule.get(PRODUCT_REPO);
    const orderRepo: InMemoryOrderRepository = testingModule.get(ORDER_REPO);

    const nest = testingModule.createNestApplication();
    nest.enableCors({origin: "*"});
    await nest.init();
    return {nest, orderRepo, productRepo};
}

// export const createTestingModule = createTestingModuleWithOverrides;
// export const createTestingModule = createTestingModuleWithIoC;
export const createTestingModule = createTestingModuleWithRegister;

@Module({
    providers: [{
        provide: "storeDB",
        useValue: null
    }],
})
class NopModule{}