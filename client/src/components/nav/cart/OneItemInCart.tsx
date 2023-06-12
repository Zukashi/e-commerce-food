import React from 'react';
import ClearIcon from "@mui/icons-material/Clear";
import {Product} from "../../../types/product";

export const  OneItemInCart = ({product}:{product:Product}) => {
    return (<> <div className='one-product-in-cart-container'>
        <div className='one-product-in-cart'>
            <img src={product.productImages[0].imageUrl} width={'60px'} height={'60px'} alt="test"/>
            <div className='product-info-container'>
                <div className='product-title-container'><p className='title'>{product.productName} </p></div>
                <div className='product-amount-price-container'><p>{product.quantity} x</p> <p className='price'>${product.price}</p></div>
            </div>

        </div>
        <ClearIcon fontSize={'small'}/>
    </div></>)
}