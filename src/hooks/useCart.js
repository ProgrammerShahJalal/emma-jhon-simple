import { useEffect } from "react";
import { useState } from "react"
import { getStoredCart } from "../utilities/fakedb";

const useCart = products => {
    const [cart, setCart] = useState([]);
    useEffect(() => {
        if (products.length) {
            const saveCart = getStoredCart();
            const storeCart = [];
            for (const key in saveCart) {
                const addedProduct = products.find(product => product.key === key)
                if (addedProduct) {
                    // set quantity
                    const quantity = saveCart[key];
                    addedProduct.quantity = quantity;
                    storeCart.push(addedProduct);
                }
            }
            setCart(storeCart);
        }
    }, [products])
    return [cart, setCart];
}

export default useCart;