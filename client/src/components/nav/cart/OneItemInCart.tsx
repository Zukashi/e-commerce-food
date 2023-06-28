import React from 'react';
import ClearIcon from "@mui/icons-material/Clear";
import {Product} from "../../../types/product";
import {useMutation, useQueryClient} from "react-query";
import {useAxiosPrivate} from "../../../hooks/use-axios-private";

export const  OneItemInCart = ({product}:{product:Product}) => {
    const axiosPrivate = useAxiosPrivate();
    const queryClient = useQueryClient();
    const deleteProduct = useMutation((id:string) => {
        return axiosPrivate.delete(`cart/product/${id}`);
    },{
        onSuccess:async () => {
            await queryClient.invalidateQueries(['cart'])

        }
    });
    return (<> <div className='one-product-in-cart-container'>
        <div className='one-product-in-cart'>
            <img src={product.productImages[0].imageUrl} width={'60px'} height={'60px'} alt="test"/>
            <div className='product-info-container'>
                <div className='product-title-container'><p className='title'>{product.productName} </p></div>
                <div className='product-amount-price-container'><p>{product.quantity} x</p> <p className='price'>${product.price}</p></div>
            </div>

        </div>
        <ClearIcon className='product-delete-button' fontSize={'small'} onClick={() => deleteProduct.mutate(product.id)}/>
    </div></>)
}