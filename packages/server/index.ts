import express from "express";
import cors from "cors";
import {Order, Product} from "./types";
import * as bodyParser from "body-parser";
import morgan from "morgan";

interface Cart {
  id: string;
  productIds: Product["id"][];
}

const app = express();
const router = express.Router();
const sessions: Record<string, Cart> = {};
const products: Product[] = [];
const orders: Order[] = [];

router.get("/cart/:cartId", (req, res) => {
  const { cartId } = req.params;
  res.json(sessions[cartId]?.productIds.length || 0);
});

router.post("/cart/:cartId", (req, res) => {
  const { cartId } = req.params;
  const { productId } = req.body;
  sessions[cartId] = sessions[cartId] || {id: cartId, productIds: []};
  sessions[cartId].productIds.push(productId)
  res.sendStatus(201);
});

router.post("/checkout/:cartId", (req, res) => {
  const { cartId } = req.params;
  const cart = sessions[cartId];
  if (!cart) {
    throw new Error(`no cart with id ${cartId} was found`);
  } else {
    const order = {
      id: cartId,
      products: cart.productIds.map(id => products.find(product => id === product.id)!)
    };
    orders.push(order)
    res.status(201).send(order.id);
  }
});

router.get("/order/:orderId", (req, res) => {
  const { orderId } = req.params;
  const order = orders.find(({id}) => orderId === id);
  if (order) {
    res.json(order);
  } else {
    res.status(404).send(`Order with id ${orderId} was not found`);
  }
});


//TODO remove
router.post("/products", (req, res) => {
  products.push(req.body);
  res.end();
})

router.get("/products", (_, res) => {
  res.send(products);
})


app.use(bodyParser.json());
app.use(cors());
app.use(router);
app.use(morgan('tiny'))
app.listen(8080, () => {
  console.log("listening to 8080");
});
