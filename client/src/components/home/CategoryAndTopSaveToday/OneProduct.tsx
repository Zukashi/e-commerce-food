import { motion } from 'framer-motion';
import React from 'react';
import {Product} from "../../../types/product";

export const OneProduct = ({product}:{product:Product}) => {
    return (<>

          <motion.div initial={{opacity:0, y:-20}} animate={{opacity:1, y:0}} className='product-container'>
              <div className='product-content-container'>
                  <div className={'img-wrapper'}>
                      <img src={product.productImages[0].imageUrl} alt={`Image of ${product.productName} product`}/>
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