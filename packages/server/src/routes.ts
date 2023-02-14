import express from "express";
import { LineItem, Order, Product } from "./types";


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

export function createRoutes(productRepo: ProductRepository, orderRepo: OrderRepository) {
    const sessions: Record<string, Cart> = {};

    const router = express.Router();

    router.get("/cart/:cartId", (req, res) => {
        const {cartId} = req.params;
        res.json(sessions[cartId]);
    });

    router.get("/cart/:cartId/count", (req, res) => {
        const {cartId} = req.params;
        res.json(sessions[cartId]?.items.length || 0);
    });

    router.post("/cart/:cartId", async (req, res) => {
        const {cartId} = req.params;
        const {productId} = req.body;
        sessions[cartId] = sessions[cartId] || {id: cartId, items: []};
        const product = await productRepo.findById(productId);

        if (product) {
            sessions[cartId].items.push(({productId, name: product.title, price: product.price}))
            res.sendStatus(201);    
        } else {
            res.sendStatus(404);    
        }
    });

    router.post("/checkout/:cartId", async (req, res) => {
        const {cartId} = req.params;
        const cart = sessions[cartId];
        if (!cart) {
            throw new Error(`no cart with id ${cartId} was found`);
        } else {

            const order = await orderRepo.create({items: cart.items});
            res.status(201).send(order.id);
        }
    });

    router.get("/order/:orderId", async (req, res) => {
        const {orderId} = req.params;
        const order = await orderRepo.findById(orderId);
        if (order) {
            res.json(order);
        } else {
            res.status(404).send(`Order with id ${orderId} was not found`);
        }
    });


//TODO remove
    router.post("/products", async (req, res) => {
        const product = await productRepo.create(req.body as Omit<Product, "id">);
        res.status(201).send(product);
    })

    router.get("/products", async (_, res) => {
        res.send(await productRepo.findAll());
    })
    return router;
}