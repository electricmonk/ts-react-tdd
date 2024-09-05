import {useContext} from "react";
import {IOContext} from "../adapters/context";
import {useQuery} from "react-query";
import {Product} from "@ts-react-tdd/server/src/types";

type ProductQuery = {
    freeTextSearch: string;
}
export const useProducts = ({freeTextSearch}: ProductQuery) => {
    const {productCatalog} = useContext(IOContext);

    const searchProducts = async () => {
        const res = await productCatalog.get<unknown[]>(`/products/search?query=${freeTextSearch}`);
        return res.data.map(p => Product.parse(p));
    };

    const findAllProducts = async () => {
        const res = await productCatalog.get<unknown[]>(`/products`);
        return res.data.map(p => Product.parse(p));
    }

    const {data, isLoading, error} = useQuery(["products", freeTextSearch], () => freeTextSearch?.length > 0 ?
        searchProducts() :
        findAllProducts());

    return {
        products: data,
        productsLoading: isLoading,
        productsError: error,
    }
}