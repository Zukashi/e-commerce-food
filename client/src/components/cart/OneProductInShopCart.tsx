import React, {useState} from 'react';
import {Product} from "../../types/product";

export const OneProductInShopCart = ({product}:{product:Product}) => {
    console.log(product.productImages[0].imageUrl)
    const [quantity, setQuantity] = useState<number>(product.quantity);
    const changeQuantity  = (num:number) => {
        if(!(num < 0))    setQuantity(num)

    }
    return (<>
       <div className='product-row-container'>



               <img className='product-image category' src={product.productImages[0].imageUrl} alt="product image"/>

           <div className='product-detail category'>

               <ul>
                   <li className='product-name'>{product.productName}</li>
                   <li>Sold by: {product.vendor.username}</li>

               </ul>
           </div>
           <div className='price category'><h4>Price</h4><h5 className='product-price'>${product.price}</h5></div>
           <div className='quantity category'><h4>Quantity</h4> <div className='quantity-price'><button onClick={() => changeQuantity(quantity - 1)}><i className='fa fa-minus ms-0' ></i></button>
               <p  >{quantity}</p><button onClick={() => changeQuantity(quantity + 1)}><i className='fa fa-plus ms-0'></i></button></div></div>
           <div className='total category'><h4>Total</h4><p>${product.quantity * product.price}</p></div>
           <div className='action category'><h4>Action</h4><p>Remove</p>
               </div>
       </div>

    </>)
}