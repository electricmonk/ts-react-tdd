import express from "express";
import cors from "cors";
import {Product} from "./types";
import * as bodyParser from "body-parser";
import morgan from "morgan";
import {MongoClient} from "mongodb";
import {MongoDBProductRepository} from "./product.repo";
import {MongoDBOrderRepository} from "./order.repo";

interface Cart {
  id: string;
  productIds: Product["id"][];
}

const app = express();

function createRoutes(productRepo: MongoDBProductRepository, orderRepo: MongoDBOrderRepository ) {
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

async function startServer() {
  const mongo = await new MongoClient(`mongodb://root:password@127.0.0.1?retryWrites=true&writeConcern=majority`).connect();

  const db = mongo.db('store');
  const productRepo = new MongoDBProductRepository(db);
  const orderRepo = new MongoDBOrderRepository(db);

  app.use(bodyParser.json());
  app.use(cors());
  app.use(createRoutes(productRepo, orderRepo));
  app.use(morgan('tiny'))
  app.listen(8080, () => {
    console.log("listening to 8080");
  });
}

void startServer();
