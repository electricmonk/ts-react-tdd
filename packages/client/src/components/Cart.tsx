import React, { useContext } from "react";
import {useNavigate} from "react-router-dom";
import { IOContext } from "../adapters/context";

interface CartProps {
    id: string;

}

export const Cart: React.FC<CartProps> = ({id}) => {
    const navigate = useNavigate();
    const { cart } = useContext(IOContext);

    const checkout = async () => {
         const orderId = await cart.checkout(id)
        navigate("/order-summary/" + orderId)
    }

    return <section>
        <button aria-label="Checkout" role="button" onClick={checkout}>Checkout</button>
    </section>
}