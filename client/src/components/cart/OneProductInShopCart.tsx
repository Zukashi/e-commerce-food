import React from 'react';
import {Product} from "../../types/product";

export const OneProductInShopCart = ({product}:{product:Product}) => {
    return (<>
        <td className='product-detail'>{<img src={product.productImages[0].imageUrl} alt=""/>}<div className='product-detail'>
            <ul>
                <li>{product.productName}</li>
                <li>{product.vendor.username}</li>

            </ul></div></td>
        <td className='price'><h4>Price</h4><h5>{product.price}</h5></td>
        <td className='quantity'>Quantity <div className='quantity-price'><button>-</button>
            <input type="text" value={product.quantity}/><button>+</button></div></td>
        <td className='total'>{product.quantity * product.price}</td>
        <td className='action'><button>save for later</button>
        <button>Remove</button></td>

    </>)
}