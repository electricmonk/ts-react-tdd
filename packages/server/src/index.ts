import {startCatalogServer} from "./catalog/main";
import {startOrdersServer} from "./orders/main";
import {startCartServer} from "./cart/main";
import {Config} from "./config";

// @ts-ignore
async function startAllMicroservicesInProcess() {
    const config = Config.parse(process.env);

    await startCatalogServer(config);
    await startOrdersServer(config);
    await startCartServer();
}

void startAllMicroservicesInProcess();