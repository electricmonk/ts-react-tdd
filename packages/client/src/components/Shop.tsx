import {Product} from "@ts-react-tdd/server/src/types";
import React, {useState} from "react";
import {useProducts} from "../hooks/products";
import {useCartWidget} from "../hooks/cart";

type ShopProps = {
    cartId: string;
}

export const Shop: React.FC<ShopProps> = ({ cartId }) => {

    const [ freeTextSearch, setFreeTextSearch ] = useState('');
    const products = useProducts(freeTextSearch);
    const { viewCart, addItem, itemCount, fetched } = useCartWidget(cartId);

    return <section>
        {fetched && (<p aria-label={`${itemCount} items in cart`}>{itemCount} items in cart</p>)}
        {fetched && !!itemCount && <button aria-label="View cart" role="button" onClick={viewCart}>View cart</button>}
        <section>
            <input type="text" aria-label="free-text-search" placeholder="Search products" value={freeTextSearch} onChange={(e) => setFreeTextSearch(e.target.value)}/>
            <button aria-label="Search">Search</button>
        </section>
        <Products addItem={addItem} products={products}/>
    </section>    
};

type ProductsProps = {
    products: {
        data: Product[] | undefined;
        isLoading: boolean;
        error: unknown | null;
    }
    addItem: (id: string) => void;
}
const Products: React.FC<ProductsProps> = ( {products: {data, isLoading, error}, addItem}) => {

    if (isLoading) {
        return <section>Loading...</section>
    }

    if (error) {
        return <section><>Error: {error}</></section>
    }

    return <>{data!.map(({ title, id }) =>
        <div key={id} aria-label={title}>
            <h3>{title}</h3>
            <button onClick={() => addItem(id)} aria-label="Add to cart" role="button">
                Add
            </button>
        </div>)}</>
}

