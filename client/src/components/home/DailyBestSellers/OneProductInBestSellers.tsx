import {motion} from "framer-motion";
import {Rating, Skeleton} from "@mui/material";
import React, {useState} from "react";
import {Product} from "../../../types/product";
import {useMutation, useQueryClient} from "react-query";
import {toast} from "react-toastify";
import {useAxiosPrivate} from "../../../hooks/use-axios-private";
import {toastPosition, toastTheme} from "../../../config/api";

export const  OneProductInBestSellers = ({product}:{product:Product}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const handleImageLoad = () => {
        setIsLoaded(true);
    };
    const queryClient = useQueryClient()
    const axiosPrivate = useAxiosPrivate()
    const addProduct = useMutation(() => {
        return axiosPrivate.post(`cart/product/${product.id}` , {quantity:1});
    },{
        onSuccess:async () => {
            await queryClient.invalidateQueries(['cart'])
            toast.success('Product ' + product.productName + ' added to cart', {
                position:toastPosition,
                theme:toastTheme
            })
        }
    });
    return  <div  className='product-container'>
        <div className='product-content-container'>
            <div className={'img-wrapper'}>
                {!isLoaded && <Skeleton variant="rectangular"  width={'240px'} height={'255px'} animation={'wave'}  />}
                <img
                    src={product.productImages[0].imageUrl}
                    onLoad={handleImageLoad}
                    alt={`Image of ${product.productName} product`}
                    style={{ display: isLoaded ? 'inline' : 'none',   height:'255px', width:'240px' }}
                />
            </div>
            <p className={'product-category'}>{product.category}</p>
            <span className='product-name'>{product.productName}</span>
            <div ><Rating size={"small"}   name="read-only" value={4} readOnly /></div>
            <p className='product-vendor'>By {product.vendor.username}</p>
            <div className='product-price-add-container'>
                <p>${product.price}</p>
                <div>

                    <motion.button onClick={() => {
                        addProduct.mutate()
                    }} className='product-button' whileHover={{ transition: { duration: 0.2 },y:-3, backgroundColor:'#3bb77e', opacity:1}}>
                        <i className="fa-solid fa-cart-shopping"></i> Add</motion.button>
                </div>
            </div>
        </div>
    </div>
}