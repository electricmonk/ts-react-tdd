import React, {useEffect, useState} from "react";
import {CartAdapter} from "../adapters/cart";
import { ProductCatalog} from "../adapters/productCatalog";
import {useNavigate} from "react-router-dom";
import {Product} from "@ts-react-tdd/server/src/types";

interface ShopProps {
    cartAdapter: CartAdapter;
    productCatalog: ProductCatalog
    cartId: string;
}

export const Shop: React.FC<ShopProps> = ({cartAdapter, cartId, productCatalog}) => {
    const [itemCount, setItemCount] = useState<number>(0);
    const [products, setProducts] = useState<Product[]>([])
    const addItem = async (productId: Product["id"]) => {
        await cartAdapter.addItem(cartId, productId);
        setItemCount(await cartAdapter.getCount(cartId));
    };

    const navigate = useNavigate();

    useEffect(() => {
        cartAdapter.getCount(cartId).then(setItemCount);
        productCatalog.findAllProducts().then(setProducts)
    }, []);

    const viewCart = () => {
        navigate('/cart');
    }

    return (
        <section>
            <p aria-label={`${itemCount} items in cart`}>{itemCount} items in cart</p>
            {itemCount && <button aria-label="View cart" role="button" onClick={viewCart}>View cart</button>}

            {products.map(({title, id}) => <div key={id} aria-label={title}>
                <h3>{title}</h3>
                <button onClick={() => addItem(id)} aria-label="Add to cart" role="button">
                    Add
                </button>
            </div>)}


        </section>
    );
};
