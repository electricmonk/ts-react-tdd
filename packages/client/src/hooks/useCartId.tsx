import { useEffect, useState } from "react";
import persistantStorage from "../services/persistantStorage";
const KEY = "cartId";

const generateCartId = () => new Date().getTime().toString();

export const useCartId = () => {
  const [cartId, setCartId] = useState<string | null>(null);

  useEffect(() => {
    const savedValue = persistantStorage.getItem(KEY);
    if (savedValue !== null) {
      setCartId(savedValue);
    } else {
      const id = generateCartId();
      persistantStorage.setItem(KEY, id);
      setCartId(id);
    }
  }, []);

  return cartId;
};
