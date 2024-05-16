import {MongoClient} from "mongodb";
import {MongoDBOrderRepository} from "./adapters/order.repo";
import {MongoDBProductRepository} from "./adapters/product.repo";
import {NestFactory} from "@nestjs/core";
import {AppModuleInversionOfControl} from "./app.module.ioc";
import {AppModuleOverrides} from "./app.module.overrides";
import {AppModuleWithRegister} from "./app.module.register";
import {MongoDBModule} from "./adapters/mongodb.module";
import {z} from "zod";

const EnvConfig = z.object({
    MONGO_URI: z.string().default('mongodb://root:password@127.0.0.1'),
    MONGO_DB: z.string().default('store'),
    MONGO_CONNECT_TIMEOUT: z.number().default(100),
    MONGO_SOCKET_TIMEOUT: z.number().default(100),
    MONGO_SERVER_SELECTION_TIMEOUT: z.number().default(100),
}).transform((input) => ({
    uri: input.MONGO_URI,
    dbName: input.MONGO_DB,
    connectTimeoutMS: input.MONGO_CONNECT_TIMEOUT,
    socketTimeoutMS: input.MONGO_SOCKET_TIMEOUT,
    serverSelectionTimeoutMS: input.MONGO_SERVER_SELECTION_TIMEOUT,
}));

// @ts-ignore
async function startServerIoC() {
    const mongo = await new MongoClient(
        `mongodb://root:password@127.0.0.1?retryWrites=true&writeConcern=majority`
    ).connect();

    const db = mongo.db("store");
    const productRepo = new MongoDBProductRepository(db);
    const orderRepo = new MongoDBOrderRepository(db);

    const app = await NestFactory.create(AppModuleInversionOfControl.register(productRepo, orderRepo))
    app.enableCors({origin: "*"});
    await app.listen(8080);
}

// @ts-ignore
async function startServerOverrides() {
    const app = await NestFactory.create(AppModuleOverrides)
    app.enableCors({origin: "*"});
    await app.listen(8080);
}

async function startServerRegister() {
    const config = EnvConfig.parse(process.env);
    const app = await NestFactory.create(AppModuleWithRegister.register(
        MongoDBModule.forRoot(config)
    ));
    app.enableCors({origin: "*"});
    await app.listen(8080);
}

void startServerRegister();


