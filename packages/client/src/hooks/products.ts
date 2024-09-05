import {useContext} from "react";
import {IOContext} from "../adapters/context";
import {useQuery} from "react-query";
import {Product} from "@ts-react-tdd/server/src/types";

type ProductQuery = {
    freeTextSearch: string;
}
export const useProducts = ({freeTextSearch}: ProductQuery) => {
    const {productCatalog} = useContext(IOContext);

    const {data, isLoading, error} = useQuery(["products", freeTextSearch], async () => {
        const url = freeTextSearch?.length > 0 ? `/products/search?query=${freeTextSearch}` : `/products`;
        const res = await productCatalog.get<unknown[]>(url);
        return res.data.map(p => Product.parse(p));
    });

    return {
        products: data,
        productsLoading: isLoading,
        productsError: error,
    }
}