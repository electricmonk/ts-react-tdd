import {useContext, useEffect, useState} from "react";
import persistantStorage from "../services/persistantStorage";
import {IOContext} from "../adapters/context";
import {useMutation, useQuery} from "react-query";
import {Product} from "@ts-react-tdd/server/src/types";
import {useNavigate} from "react-router-dom";

const KEY = "cartId";

const generateCartId = () => new Date().getTime().toString();

export const useCartId = () => {
    const [cartId, setCartId] = useState<string | null>(null);

    const resetCartId = () => {
        persistantStorage.setItem(KEY, null);
        setCartId(null);
    };

    useEffect(() => {
        if (cartId === null) {
            const savedValue = persistantStorage.getItem(KEY);
            if (savedValue !== null) {
                setCartId(savedValue);
            } else {
                const id = generateCartId();
                persistantStorage.setItem(KEY, id);
                setCartId(id);
            }
        }
    }, [cartId]);

    return {cartId, resetCartId};
};

export const useCartSummary = (id: string) => {
    const {cart} = useContext(IOContext);
    const {data: summary, isLoading, error} = useQuery({
        queryKey: 'cartSummary',
        queryFn: () => cart.getCartSummary(id)
    })

    const checkout = async () => {
        return cart.checkout(id);
    }

    return {isLoading, error, summary, checkout};
}
export const useCartWidget = (cartId: string) => {
    const {cart} = useContext(IOContext);

    const itemCount = useQuery({
        queryKey: "itemCount",
        queryFn: () => cart.getCount(cartId),
        onError: (error) => console.error(error)
    });
    const addItem = useMutation({
        onError: (error) => console.error(error),
        mutationFn: async (productId: Product["id"]) => {
            await cart.addItem(cartId, productId);
            await itemCount.refetch();
        }
    });

    const navigate = useNavigate();

    const viewCart = () => {
        navigate('/cart');
    }

    return {
        viewCart,
        addItem: addItem.mutate,
        itemCount: itemCount.data,
        fetched: itemCount.isFetched
    }
}