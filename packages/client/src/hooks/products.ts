import {useContext} from "react";
import {IOContext} from "../adapters/context";
import {useQuery} from "react-query";

type ProductQuery = {
    freeTextSearch: string;
}
export const useProducts = ({freeTextSearch}: ProductQuery) => {
    const {productCatalog} = useContext(IOContext);
    const {data, isLoading, error} = useQuery(["products", freeTextSearch], () => freeTextSearch?.length > 0 ?
        productCatalog.searchProducts(freeTextSearch) :
        productCatalog.findAllProducts());

    return {
        products: data,
        productsLoading: isLoading,
        productsError: error,
    }
}