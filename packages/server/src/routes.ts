import {LineItem, Order, Product, ProductTemplate} from "./types";
import {FastifyInstance, FastifyRequest} from "fastify";


type Cart = {
    id: string;
    items: LineItem[];
}

export interface ProductRepository {
    findById(productId: Product["id"]): Promise<Product | undefined>;
    create(template: Omit<Product, "id">): Promise<Product>;
    findAll(): Promise<Product[]>;
}

export interface OrderRepository {
    create(order: Omit<Order, "id">): Promise<Order>;
    findById(orderId: string): Promise<Order | null>;

}

type CartId = {Params: {cartId: string}};
type OrderId = {Params: {orderId: string}};

export const createRoutes = (productRepo: ProductRepository, orderRepo: OrderRepository) => (fastify: FastifyInstance, opts: any, done: () => void) => {
    const sessions: Record<string, Cart> = {};

    fastify.get("/cart/:cartId", (req: FastifyRequest<CartId>, res) => {
        const {cartId} = req.params;
        res.send(sessions[cartId]);
    });

    fastify.get("/cart/:cartId/count", (req: FastifyRequest<CartId>, res) => {
        const {cartId} = req.params;
        res.send(sessions[cartId]?.items.length || 0);
    });

    fastify.post("/cart/:cartId", async (req: FastifyRequest<CartId & {Body: {productId: string}}> , res) => {
        const {cartId} = req.params;
        const {productId} = req.body;
        sessions[cartId] = sessions[cartId] || {id: cartId, items: []};
        const product = await productRepo.findById(productId);

        if (product) {
            sessions[cartId].items.push(({productId, name: product.title, price: product.price}))
            res.status(201).send();
        } else {
            res.status(404).send();
        }
    });

    fastify.post("/checkout/:cartId", async (req: FastifyRequest<CartId>, res) => {
        const {cartId} = req.params;
        const cart = sessions[cartId];
        if (!cart) {
            throw new Error(`no cart with id ${cartId} was found`);
        } else {

            const order = await orderRepo.create({items: cart.items});
            res.status(201).send(order.id);
        }
    });

    fastify.get("/order/:orderId", async (req: FastifyRequest<OrderId>, res) => {
        const {orderId} = req.params;
        const order = await orderRepo.findById(orderId);
        if (order) {
            res.send(order);
        } else {
            res.status(404).send(`Order with id ${orderId} was not found`);
        }
    });


//TODO remove
    fastify.post("/products", async (req, res) => {
        const product = await productRepo.create(ProductTemplate.parse(req.body));
        res.status(201).send(product);
    })

    fastify.get("/products", async (_, res) => {
        res.send(await productRepo.findAll());
    })

    done();
}