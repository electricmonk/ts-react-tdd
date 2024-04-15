import {LineItem, ProductTemplate} from "./types";
import {FastifyInstance} from "fastify";
import {serializerCompiler, validatorCompiler, ZodTypeProvider} from "fastify-type-provider-zod";
import {z} from "zod";
import { ProductRepository } from "./adapters/product.repo";
import { OrderRepository } from "./adapters/order.repo";

type Cart = {
    id: string;
    items: LineItem[];
}

const CartIdSchema = z.object({
    cartId: z.string()
});

export const createRoutes = (productRepo: ProductRepository, orderRepo: OrderRepository) => (fastify: FastifyInstance, opts: any, done: () => void) => {
    fastify.setValidatorCompiler(validatorCompiler);
    fastify.setSerializerCompiler(serializerCompiler);

    const f = fastify.withTypeProvider<ZodTypeProvider>();

    const sessions: Record<string, Cart> = {};

    f.route({
        url: "/cart/:cartId",
        method: "GET",
        schema: {
            params: CartIdSchema,
        },
        handler: (req, res) => {
            const {cartId} = req.params;
            res.send(sessions[cartId]);
        }
    });

    f.route({
        method: "GET",
        url: "/cart/:cartId/count",
        schema: {
            params: CartIdSchema,
        },
        handler: (req, res) => {
            const {cartId} = req.params;
            res.send(sessions[cartId]?.items.length || 0);
        }
    });

    f.route({
        url: "/cart/:cartId",
        method: "POST",
        schema: {
            body: z.object({
                productId: z.string()
            }),
            params: CartIdSchema,
        },
        handler: async (req, res) => {
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
        }
    });

    f.route({
        method: "POST",
        url: "/checkout/:cartId",
        schema: {
            params: CartIdSchema,
        },
        handler: async (req, res) => {
            const {cartId} = req.params;
            const cart = sessions[cartId];
            if (!cart) {
                throw new Error(`no cart with id ${cartId} was found`);
            } else {

                const order = await orderRepo.create({items: cart.items});
                res.status(201).send(order.id);
            }
        }
    });

    f.route({
        method: "GET",
        url: "/order/:orderId",
        schema: {
            params: z.object({
                orderId: z.string(),
            })
        },
        handler: async (req, res) => {
            const {orderId} = req.params;
            const order = await orderRepo.findById(orderId);
            if (order) {
                res.send(order);
            } else {
                res.status(404).send(`Order with id ${orderId} was not found`);
            }
        }
    });


//TODO remove
    f.route({
        method: "POST",
        url: "/products",
        schema: {
            body: ProductTemplate,
        },
        handler: async (req, res) => {
            const product = await productRepo.create(req.body);
            res.status(201).send(product);
        }
    })

    f.get("/products", async (_, res) => {
        res.send(await productRepo.findAll());
    })

    done();
}