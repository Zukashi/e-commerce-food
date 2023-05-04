import React from 'react';
import {Product} from "../../types/product";

export const OneProductInShopCart = ({product}:{product:Product}) => {
    return (<>
       <div className='product-row-container'>
           <td className='product-detail'><div className='img-productName'>
               {<img src={product.productImages[0].imageUrl} alt=""/>}<div className='product-detail'>
               <ul>
                   <li>{product.productName}</li>
                   <li>{product.vendor.username}</li>

               </ul></div>
           </div></td>
           <td className='price'><h4>Price</h4><h5 className='product-price'>${product.price}</h5></td>
           <td className='quantity'><h4>Quantity</h4> <div className='quantity-price'><button>-</button>
               <input type="text" value={product.quantity}/><button>+</button></div></td>
           <td className='total'><h4>Total</h4>{product.quantity * product.price}</td>
           <td className='action'><h4>Action</h4><button>save for later</button>
               <button>Remove</button></td>
       </div>

    </>)
}