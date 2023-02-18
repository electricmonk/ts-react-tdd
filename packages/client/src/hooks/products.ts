import {useContext} from "react";
import {IOContext} from "../adapters/context";
import {useQuery} from "react-query";

type ProductQuery = {
    freeTextSearch: string;
}
export const useProducts = ({freeTextSearch}: ProductQuery) => {
    const {productCatalog} = useContext(IOContext);
    const {data, isLoading, error} = useQuery("products", () => productCatalog.findAllProducts());

    const products = data && (freeTextSearch.length > 0 ? data.filter(p => p.title.toLowerCase().includes(freeTextSearch.toLowerCase())) : data)

    return {
        products,
        productsLoading: isLoading,
        productsError: error,
    }
}