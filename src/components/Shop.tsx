import React, { useEffect, useState } from "react";

interface CartAdapter {
  getCount: () => Promise<number>;
  addItem: () => Promise<void>;
}

interface ShopProps {
  cartAdapter: CartAdapter;
}

export const Shop: React.FC<ShopProps> = ({ cartAdapter }) => {
  const [itemCount, setItemCount] = useState<number>(0);
  const addItem = async () => {
    await cartAdapter.addItem();
    setItemCount(await cartAdapter.getCount());
  };

  useEffect(() => {
    cartAdapter.getCount().then(setItemCount);
  }, []);

  return (
    <>
      <button onClick={addItem} aria-label="Add to cart" role="button">
        Add
      </button>
      <p aria-label={`${itemCount} items in cart`}>{itemCount} items in cart</p>
    </>
  );
};
