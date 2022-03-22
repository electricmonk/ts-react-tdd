import React, { useEffect, useState } from "react";
import { CartAdapter } from "../adapters/cart";
import {useNavigate} from "react-router-dom";

interface ShopProps {
  cartAdapter: CartAdapter;
  cartId: string;
}

export const Shop: React.FC<ShopProps> = ({ cartAdapter, cartId }) => {
  const [itemCount, setItemCount] = useState<number>(0);
  const addItem = async () => {
    await cartAdapter.addItem(cartId);
    setItemCount(await cartAdapter.getCount(cartId));
  };

  useEffect(() => {
    cartAdapter.getCount(cartId).then(setItemCount);
  }, []);

  const navigate = useNavigate();

  const viewCart = () => {
    navigate('/cart');
  }

  return (
    <section>
      <button onClick={addItem} aria-label="Add to cart" role="button">
        Add
      </button>
      <p aria-label={`${itemCount} items in cart`}>{itemCount} items in cart</p>
      {itemCount && <button aria-label="View cart" role="button" onClick={viewCart}>View cart</button>}
    </section>
  );
};
