
import React from 'react';
import {useQuery} from "react-query";
import {useAxiosPrivate} from "../../hooks/use-axios-private";
import {AxiosInstance} from "axios";
import {Product} from "../../types/product";
import {Loader} from "../loader/Loader";
import { OneProductInShopCart } from './OneProductInShopCart';
import './cart-table.scss';
import './cart-total.scss';
const fetchCart = async (axios:AxiosInstance):Promise<Product[]> => {
    const res = await axios.get('cart');
    return res.data
}
export const ShopCart = () => {
    const axiosPrivate = useAxiosPrivate();
    const {data:products, isLoading} = useQuery('cart', () => fetchCart(axiosPrivate))
    const redirectToCheckout =  async () => {
        const res = await axiosPrivate.post('stripe/checkout/session', {
            items:products
        });
        window.location = res.data

    }
    if(isLoading){
        return <Loader/>
    }
    return(<><section style={{backgroundColor:'#fff'}}>
        <div className='table-container'><div className='product-table'> {products?.map((product) => <div key={product.id} className='product-row'><OneProductInShopCart product={product}key={product.id}/></div>)}</div></div>

    </section>

        <section className={"cart-total"}>
            <div className='cart-total-content'>
                <h2>Cart Total</h2>
                <div className='price-container'>
                    <b>Total (USD)</b>
                    <b>${products?.reduce((acc, currentValue) => acc + currentValue.price, 0)}</b>
                </div>
                <button onClick={redirectToCheckout} className='submit-button'>Process To Checkout</button>
            </div>
        </section>
    </>)
}