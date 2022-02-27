import express from "express";
import cors from "cors";

const app = express();
const router = express.Router();
let count = 0;
router.get("/cart", (_, res) => {
  res.json(count);
});

router.post("/cart", (_, res) => {
  count++;
  res.end();
});

app.use(cors());
app.use(router);
app.listen(8080, () => {
  console.log("listening to 8080");
});
