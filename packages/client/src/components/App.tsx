import React, { useRef } from "react";
import { Shop } from "./Shop";
import { HTTPCartAdapter } from "../adapters/cart";

const cartAdapter = new HTTPCartAdapter(process.env.API_URL!);
export const App: React.FC = () => {
  return <Shop cartAdapter={cartAdapter} />;
};
