import {useContext} from "react";
import {IOContext} from "../adapters/context";
import {useQuery} from "react-query";

export const useProducts = () => {
    const {productCatalog} = useContext(IOContext);
    const {data, isLoading, error} = useQuery("products", () => productCatalog.findAllProducts());

    return {
        products: data,
        productsLoading: isLoading,
        productsError: error,
    }
}