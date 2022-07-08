import { Product as ProductSummary } from "@ts-react-tdd/server/src/types";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IOContext } from "../adapters/context";

interface ShopProps {
    cartId: string;
}

export const Shop: React.FC<ShopProps> = ({cartId}) => {
    const { cart, productCatalog } = useContext(IOContext);
    
    const [itemCount, setItemCount] = useState<number>(0);
    const [products, setProducts] = useState<ProductSummary[]>([])
    const addItem = async (productId: ProductSummary["id"]) => {
        await cart.addItem(cartId, productId);
        setItemCount(await cart.getCount(cartId));
    };

    const navigate = useNavigate();

    useEffect(() => {
        cart.getCount(cartId).then(setItemCount);
        productCatalog.findAllProducts().then(setProducts)
    }, []);

    const viewCart = () => {
        navigate('/cart');
    }

    return (
        <section>
            <p aria-label={`${itemCount} items in cart`}>{itemCount} items in cart</p>
            {itemCount && <button aria-label="View cart" role="button" onClick={viewCart}>View cart</button>}

            {products.map(product => <ProductSummary product={product} onAddItem={addItem}/>)}

        </section>
    );
};

const ProductSummary: React.FC<{product: ProductSummary, onAddItem: (productId: ProductSummary["id"]) => any}> = ({product: {title, id, price}, onAddItem}) => 
    <div key={id} aria-label={title}>
        <h3>{title}</h3>
        <span aria-label={`${title} price`}>${price}</span>
        <button onClick={() => onAddItem(id)} aria-label="Add to cart" role="button">
            Add
        </button>
    </div>