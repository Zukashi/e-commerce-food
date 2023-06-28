import React, {useState} from 'react';
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import {Product} from "../../../types/product";
import {OneItemInCart} from "./OneItemInCart";
import {Link} from "react-router-dom";
import {useAxiosPrivate} from "../../../hooks/use-axios-private";
import {useMutation} from "react-query";
import {toast} from "react-toastify";
import {Loader} from "../../loader/Loader";

export const Cart = ({data}:{data:Product[]}) => {

    const createSession = useMutation( () => {

        return axiosPrivate.post('stripe/checkout/session', {
            items:data
        });
    },{
        onSuccess:async (data) => {
            window.location = data.data.url
        }
    });

    const axiosPrivate = useAxiosPrivate()
    const redirectToCheckout =  async () => {
        createSession.mutate()
    }

    return (<><div className='fade-container '>
        <div className='account-dropdown dropdown-animate cart'  >
            {data.length > 0 ? <> <ul className='account-list cart-list'>
            {data?.map((product) => <OneItemInCart key={product.id} product={product}/>)}

                </ul>
                <div className='total-cart'>
                <p className='total'>Total</p>
                <p className='price'>${data?.reduce((prev, value, index) => {
                return prev + value.price
            }, 0)}</p>
                </div>
                <div className='cart-buttons'>
                <Link to={'/cart'}><button className='inversed-primary-button' >View Cart</button></Link>
                <button className='primary-button' onClick={redirectToCheckout} >Checkout</button>
                </div></> : <div className='cart-empty-nav'><img src="https://www.99fashionbrands.com/wp-content/uploads/2020/12/empty_cart.png" alt=""/></div>}
        </div>
        <ShoppingCartOutlinedIcon  className={'trigger-fade'} fontSize={'large'}/>
        <p className="nav-item-text">Cart</p>
    </div></>)
}