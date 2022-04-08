import {MongoDBProductRepository} from "./product.repo";
import {MongoDBOrderRepository} from "./order.repo";
import express from "express";
import {Product} from "./types";


interface Cart {
    id: string;
    productIds: Product["id"][];
}

export function createRoutes(productRepo: MongoDBProductRepository, orderRepo: MongoDBOrderRepository) {
    const sessions: Record<string, Cart> = {};

    const router = express.Router();

    router.get("/cart/:cartId", (req, res) => {
        const {cartId} = req.params;
        res.json(sessions[cartId]?.productIds.length || 0);
    });

    router.post("/cart/:cartId", (req, res) => {
        const {cartId} = req.params;
        const {productId} = req.body;
        sessions[cartId] = sessions[cartId] || {id: cartId, productIds: []};
        sessions[cartId].productIds.push(productId)
        res.sendStatus(201);
    });

    router.post("/checkout/:cartId", async (req, res) => {
        const {cartId} = req.params;
        const cart = sessions[cartId];
        if (!cart) {
            throw new Error(`no cart with id ${cartId} was found`);
        } else {
            const products = await productRepo.findByIds(cart.productIds);

            const order = await orderRepo.create({products});
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