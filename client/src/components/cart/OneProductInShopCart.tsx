import React, {useEffect, useState} from 'react';
import {Product} from "../../types/product";
import {useMutation, useQueryClient} from "react-query";
import {AxiosInstance} from "axios";
import {useAxiosPrivate} from "../../hooks/use-axios-private";
const changeQuantityOfCart = async (axios:AxiosInstance, quantity:number, productId:string) => {
    const res = await axios.patch(`cart/product/${productId}/quantity`, {quantity})
}
export const OneProductInShopCart = ({product}:{product:Product}) => {
    const [quantity, setQuantity] = useState<number>( product.quantity);
    const queryClient = useQueryClient()
    const axiosPrivate = useAxiosPrivate()
    const { mutate, isLoading, error } = useMutation(async () => {
        console.log(quantity)
        const res = await axiosPrivate.patch(`cart/product/${product.id}/quantity`, {quantity})
        return res.data
    }, {
        onSuccess: (data) => {
            queryClient.setQueryData(['cart'], data)
        },
        onError: (error) => {
            // Error actions
        },
    });
    const deleteProduct = useMutation((id:string) => {
        return axiosPrivate.delete(`cart/product/${id}`);
    },{
        onSuccess:async () => {
            await queryClient.invalidateQueries(['cart'])

        }
    });
    const changeQuantity  = (num:number) => {

        if(!(num < 1))  setQuantity( num)

    }
    useEffect(() => {
        console.log(quantity)
        mutate();
    }, [quantity]);
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
           <div className='total category'><h4>Total</h4><p>${quantity * product.price}</p></div>
           <div className='action category'><h4>Action</h4><p onClick={() => deleteProduct.mutate(product.id)}>Remove</p>
               </div>
       </div>

    </>)
}