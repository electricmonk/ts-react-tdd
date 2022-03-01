import express from "express";
import cors from "cors";

const app = express();
const router = express.Router();
const sessions: Record<string, number> = {};

export type ProductCount = number;

router.get("/cart/:cartId", (req, res) => {
  const { cartId } = req.params;
  res.json(sessions[cartId] || 0);
});

router.post("/cart/:cartId", (req, res) => {
  const { cartId } = req.params;
  sessions[cartId] = sessions[cartId] ? sessions[cartId] + 1 : 1;
  res.end();
});

app.use(cors());
app.use(router);
app.listen(8080, () => {
  console.log("listening to 8080");
});
