import { motion } from 'framer-motion';
import React, {useState} from 'react';
import {Product} from "../../../types/product";

export const OneProduct = ({product, framerKey}:{product:Product, framerKey:URLSearchParams}) => {
    const [isLoaded, setIsLoaded] = useState(false);

    const handleImageLoad = () => {
        setIsLoaded(true);
    };
    return (<>

          <motion.div key={framerKey.get('filter')}  style={{opacity: isLoaded ? 1 :0  }} initial={{opacity:0, y:40 }} animate={{opacity:1, y:0}}   transition={{duration:0.4}} className='product-container'>
              <div className='product-content-container'>
                  <div className={'img-wrapper'}>
                      <img src={product.productImages[0].imageUrl} onLoad={handleImageLoad} alt={`Image of ${product.productName} product`}/>
                  </div>
                  <p>{product.category}</p>
                  <span>{product.productName}</span>
                  <div>stars</div>
                  <p>By {product.vendor.username}</p>
                  <div className='product-price-add-container'>
                      <p>${product.price}</p>
                      <button>Add</button>
                  </div>
              </div>
          </motion.div>




    </>)
}