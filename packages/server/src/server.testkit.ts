import {ProductTemplate} from "./types";
import {Test} from "@nestjs/testing";
import {InMemoryOrderRepository, InMemoryProductRepository} from "./adapters/fake";
import {AppModuleInversionOfControl} from "./monolith/app.module.ioc";
import {AppModuleOverrides} from "./monolith/app.module.overrides";
import {ORDER_REPO, PRODUCT_REPO} from "./adapters";
import {MongoDBModule} from "./adapters/mongodb.module";
import {Module} from "@nestjs/common";
import {AppModuleWithRegister} from "./monolith/app.module.register";
import {MemoryModule} from "./adapters/memory.module";
import {createCatalogApp} from "./catalog/app";
import {createOrdersApp} from "./orders/app";
import {createCartApp} from "./cart/app";
import EventEmitter from "node:events";
import {MemoryClientsModule, MemoryTransportServer} from "nest-memory-transport";
import {CART_CLIENT} from "./cart/kafkaCartManager";

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

    const productRepo = testingModule.get<InMemoryProductRepository>(PRODUCT_REPO);
    const orderRepo = testingModule.get<InMemoryOrderRepository>(ORDER_REPO);

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

export async function runMicroservices(products: ProductTemplate[] = []) {

    const emitter = new EventEmitter();
    const strategy = new MemoryTransportServer(emitter);

    const productRepo = new InMemoryProductRepository(products);
    const orderRepo = new InMemoryOrderRepository();

    const catalogApp = await createCatalogApp(productRepo, {strategy});
    const ordersApp = await createOrdersApp(orderRepo, {strategy});
    const cartApp = await createCartApp(MemoryClientsModule.register({
        name: CART_CLIENT,
        emitter,
    }), orderRepo);

    return {catalogApp, ordersApp, cartApp, orderRepo, productRepo};
}
