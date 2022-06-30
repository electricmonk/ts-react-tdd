import React from "react";
import {CartAdapter} from "../adapters/cart";
import { ProductCatalog} from "../adapters/productCatalog";
import {useNavigate} from "react-router-dom";
import {Product} from "@ts-react-tdd/server/src/types";
import { useMutation, useQuery } from "react-query";
import { useRecoilValue } from "recoil";
import { CartId } from "../state";

interface ShopProps {
    cartAdapter: CartAdapter;
    productCatalog: ProductCatalog
}

export const Shop: React.FC<ShopProps> = ({cartAdapter, productCatalog}) => {
    const navigate = useNavigate();
    const cartId = useRecoilValue(CartId);

    const itemCount = useQuery("itemCount", () => cartAdapter.getCount(cartId));
    const products = useQuery("products", () => productCatalog.findAllProducts());
    const addItem = useMutation(async (productId: Product["id"]) => {
        await cartAdapter.addItem(cartId, productId);
        itemCount.refetch();
    })

    const viewCart = () => {
        navigate('/cart');
    }

    return (
        <section>
            { itemCount.isFetched && ( <p aria-label={`${itemCount.data} items in cart`}>{itemCount.data} items in cart</p>)}
           
            { itemCount.isFetched && !!itemCount.data && <button aria-label="View cart" role="button" onClick={viewCart}>View cart</button>}
            
            <Products addItem={addItem.mutate} products={products.data} isLoading={products.isLoading} error={products.error}/>
        </section>
    );
};

const Products: React.FC<{products: Product[] | undefined, isLoading: boolean, error: unknown | null, addItem: (id: string) => void}> = ({products, isLoading, error, addItem}) => {

    if (isLoading) {
        return <section>Loading...</section>
    }

    if (error) {
        return <section>Error: {error}</section>
    }

    return <>{products!.map(({title, id}) => 
        <div key={id} aria-label={title}>
            <h3>{title}</h3>
            <button onClick={() => addItem(id)} aria-label="Add to cart" role="button">
                Add
            </button>
        </div>)}</>
}
         
