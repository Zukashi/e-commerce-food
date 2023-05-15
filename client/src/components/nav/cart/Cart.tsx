import React from 'react';
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import {Product} from "../../../types/product";
import {OneItemInCart} from "./OneItemInCart";

export const Cart = ({data}:{data:Product[]}) => {
    return (<><div className='fade-container '>
        <div className='account-dropdown dropdown-animate cart'>
            <ul className='account-list cart-list'>
                {data?.map((product) => <OneItemInCart key={product.id} product={product}/>)}

            </ul>
            <div className='total-cart'>
                <p className='total'>Total</p>
                <p className='price'>${data?.reduce((prev, value, index) => {
                    return prev + value.price
                }, 0)}</p>
            </div>
            <div className='cart-buttons'>
                <button className='inversed-primary-button'>View Cart</button>
                <button className='primary-button' >Checkout</button>
            </div>
        </div>
        <ShoppingCartOutlinedIcon className={'trigger-fade'} fontSize={'large'}/>
        <p className="nav-item-text">Cart</p>
    </div></>)
}