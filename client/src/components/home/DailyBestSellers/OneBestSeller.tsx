import React from 'react';
import {Rating} from "@mui/material";
import {motion} from "framer-motion";
import {Product} from "../../../types/product";

export const OneBestSeller = ({product}:{product:Product}) => {
    return ( <>
        <div className='best-product-container'>
            <div className='best-product-content-container'>
                <div className='best-image-wrapper'>
                    <img
                        src={product?.productImages[0]?.imageUrl}

                        alt={`Image of ${product.productName} product`}
                        style={{    height:'255px', width:'240px' }}
                    />
                </div>
                <p className='best-product-category'>{product.category}</p>
                <p className='best-product-name'>{product.productName}</p>
                <div ><Rating size={"small"}   name="read-only" value={4} readOnly /></div>
                <p className='best-product-vendor'>By {product.vendor.username}</p>
                <div className='best-product-price-add-container'>
                    <p>${product.price}</p>
                    <div>

                        <motion.button  className='best-product-button'  whileHover={{ transition: { duration: 0.2 },y:0, backgroundColor:'#3bb77e', opacity:1}}>
                            <i className="fa-solid fa-cart-shopping"></i> Add</motion.button>
                    </div>
                </div>
            </div>
        </div>
    </>)
}