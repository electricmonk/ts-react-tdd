import React, { useState } from "react";

export const App: React.FC = () => {
  const [itemCount, setItemCount] = useState<number>(0);
  const addItem = () => setItemCount(itemCount + 1);

  return (
    <>
      <button onClick={addItem} aria-label="Add to cart" role="button">
        Add
      </button>
      <p aria-label={`${itemCount} item in cart`}>{itemCount} items in cart</p>;
    </>
  );
};
