import {z} from "zod";

export const Config = z.object({
    MONGO_URI: z.string().default('mongodb://root:password@127.0.0.1'),
    MONGO_DB: z.string().default('storeDB'),
    MONGO_CONNECT_TIMEOUT: z.number().default(1000),
    MONGO_SOCKET_TIMEOUT: z.number().default(1000),
    MONGO_SERVER_SELECTION_TIMEOUT: z.number().default(1000),
}).transform((input) => ({
    uri: input.MONGO_URI,
    dbName: input.MONGO_DB,
    connectTimeoutMS: input.MONGO_CONNECT_TIMEOUT,
    socketTimeoutMS: input.MONGO_SOCKET_TIMEOUT,
    serverSelectionTimeoutMS: input.MONGO_SERVER_SELECTION_TIMEOUT,
}));