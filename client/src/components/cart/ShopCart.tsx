
import React from 'react';
import {useQuery} from "react-query";
import {useAxiosPrivate} from "../../hooks/use-axios-private";
import {AxiosInstance} from "axios";
import {Product} from "../../types/product";
import {Loader} from "../loader/Loader";
import { OneProductInShopCart } from './OneProductInShopCart';
import './scss/cart-table.scss';
import './scss/cart-total.scss';
import './scss/cart-main.scss'
import {Link, Navigate, useNavigate} from "react-router-dom";
import {Simulate} from "react-dom/test-utils";
import cut = Simulate.cut;
const fetchCart = async (axios:AxiosInstance):Promise<Product[]> => {
    const res = await axios.get('cart');
    return res.data
}
export const ShopCart = () => {
    const axiosPrivate = useAxiosPrivate();
    const {data:products, isLoading, isFetching} = useQuery('cart', () => fetchCart(axiosPrivate))
    const navigate =useNavigate()
    const arrSum = products?.reduce((acc, currentValue) => acc + currentValue.price * currentValue.quantity, 0)

    if(isLoading || isFetching || !products){
        return <Loader/>
    }
    if(products.length < 1){
        return <>
            <h2 className='cart-empty'><img src="https://www.99fashionbrands.com/wp-content/uploads/2020/12/empty_cart.png" alt=""/></h2>
            <div className='cart-empty-button'>
                <div>
                    <Link to='/'><button>Return to home</button></Link>
                </div>
            </div>
        </>
    }
    return(<main className='cart-main'><section className={"cart-table"} style={{backgroundColor:'#fff'}}>
        <div className='table-container'><div className='product-table'> {products?.map((product) => <div key={product.id} className='product-row'><OneProductInShopCart product={product}key={product.id}/></div>)}</div></div>

    </section>

        <section className={"cart-total"}>
            <div className='cart-total-content'>
                <h2>Cart Total</h2>
                <div className='price-container'>
                    <b>Total (USD)</b>
                    <b>${arrSum}</b>
                </div>
                <div className='button-container-cart'>
                    <Link to={'/payment'} state={arrSum}><button  className='proceed-to-checkout-button'>Proceed To Checkout</button></Link>
                    <button onClick={() => navigate(-1)}  className='return-to-shopping-button'><i className='fa-solid fa-arrow-left-long'></i> Return To Shopping</button>
                </div>
            </div>
        </section>
    </main>)
}