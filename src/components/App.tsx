import React, { useRef } from "react";
import { Shop } from "./Shop";
import InMemoryCartAdapter from "../adapters/cart";

const cartAdapter = new InMemoryCartAdapter();
export const App: React.FC = () => {
  return <Shop cartAdapter={cartAdapter} />;
};
