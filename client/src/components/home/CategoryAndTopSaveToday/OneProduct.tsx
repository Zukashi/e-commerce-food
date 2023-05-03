import {Rating, Skeleton} from '@mui/material';
import { motion } from 'framer-motion';
import React, {useState} from 'react';
import {Product} from "../../../types/product";
import {useAxiosPrivate} from "../../../hooks/use-axios-private";

export const OneProduct = ({product, framerKey}:{product:Product, framerKey:URLSearchParams}) => {
    const [isLoaded, setIsLoaded] = useState(false);

    const handleImageLoad = () => {
        setIsLoaded(true);
    };
    const axiosPrivate = useAxiosPrivate()
    const onSubmit = async () => {
        await axiosPrivate.post(`cart/product/${product.id}`, {quantity:1})
    }
    return (<>

          <motion.div key={framerKey.get('filter')}  style={{opacity: isLoaded ? 1 :0  }} initial={{opacity:0, y:40 }} animate={{opacity:1, y:0}}   transition={{duration:0.4}} className='product-container'>
              <div className='product-content-container'>
                  <div className={'img-wrapper'}>
                      {!isLoaded && <Skeleton variant="rectangular"  width={'240px'} height={'255px'} animation={'wave'}  />}
                      <img
                          src={product.productImages[0].imageUrl}
                          onLoad={handleImageLoad}
                          alt={`Image of ${product.productName} product`}
                          style={{ display: isLoaded ? 'block' : 'none',   height:'255px', width:'240px' }}
                      />
                  </div>
                  <p className={'product-category'}>{product.category}</p>
                  <span className='product-name'>{product.productName}</span>
                  <div ><Rating size={"small"}   name="read-only" value={4} readOnly /></div>
                  <p className='product-vendor'>By {product.vendor.username}</p>
                  <div className='product-price-add-container'>
                      <p>${product.price}</p>
                      <motion.button onClick={() => {
                          onSubmit()
                      }} className='product-button' whileHover={{ transition: { duration: 0.2 },y:-3, backgroundColor:'#3bb77e', opacity:1}}>Add</motion.button>
                  </div>
              </div>
          </motion.div>




    </>)
}