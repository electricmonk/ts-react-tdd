import {useContext} from "react";
import {IOContext} from "../adapters/context";
import {useQuery} from "react-query";
import {Product} from "@ts-react-tdd/server/src/types";

export const useProducts = (query: string) => {
    const {productCatalog} = useContext(IOContext);
    const url = query?.length > 0 ? `/products/search?query=${query}` : `/products`;

    return useQuery(["products", query], async () => {
        const res = await productCatalog.get<unknown[]>(url);
        return res.data.map(p => Product.parse(p));
    });
}