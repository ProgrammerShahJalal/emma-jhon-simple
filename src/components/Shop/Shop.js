import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import './Shop.css'
import Product from '../Product/Product';
import Cart from '../Cart/Cart';
import { addToDb, getStoredCart } from '../../utilities/fakedb';
import { Link } from 'react-router-dom';


const Shop = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [displayProducts, setDisplayproducts] = useState([]);

    useEffect(() => {
        fetch('./products.json')
            .then(res => res.json())
            .then(data => {
                setProducts(data)
                setDisplayproducts(data)
            })
    }, [])

    useEffect(() => {
        if (products.length) {
            const saveCart = getStoredCart();
            const storeCart = [];
            for (const key in saveCart) {
                const addedProduct = products.find(product => product.key === key);
                if (addedProduct) {
                    const quantity = saveCart[key];
                    addedProduct.quantity = quantity;
                    storeCart.push(addedProduct);
                }
            }
            setCart(storeCart);
        }
    }, [products])
    const handleAddToCart = product => {
        const exists = cart.find(pd => pd.key === product.key);
        let newCart = [];
        if (exists) {
            const rest = cart.filter(pd => pd.key !== product.key);
            exists.quantity = exists.quantity + 1;
            newCart = [...rest, product];
        }
        else {
            product.quantity = 1;
            newCart = [...cart, product];
        }

        setCart(newCart);
        // save to local storage for now
        addToDb(product.key);
    }

    const handleSearch = event => {
        const searchText = event.target.value;
        const matchProducts = products.filter(product => product.name.toLowerCase().includes(searchText.toLowerCase()));
        setDisplayproducts(matchProducts);
    }
    const element = <FontAwesomeIcon icon={faShoppingCart} />

    let totalQuantity = 0;
    for (const product of cart) {
        if (!product.quantity) {
            product.quantity = 1;
        }
        totalQuantity = totalQuantity + product.quantity;
    }
    return (
        <div>
            <div className="search-field">
                <input
                    type="text"
                    placeholder="type here to search..."
                    onChange={handleSearch}
                />
                <span>
                    <span id="shopping-bag">{element}</span>
                    <span id="quantity">{totalQuantity}</span>
                </span>
            </div>
            <div className="shop-container">
                <div className="product-container">
                    {
                        displayProducts.map(product => <Product
                            key={product.key}
                            product={product}
                            handleAddToCart={handleAddToCart}
                        ></Product>)
                    }
                </div>
                <div className="card-container">
                    <Cart cart={cart}>
                        <Link to='/review'> <button className='btn-regular'>Review Order</button></Link>
                    </Cart>
                </div>
            </div>
        </div>
    );
};

export default Shop;