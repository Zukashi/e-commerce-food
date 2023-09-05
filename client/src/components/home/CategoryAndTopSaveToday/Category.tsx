import React, {useEffect, useState} from 'react';
import './scss/category.scss'
import {useSearchParams} from "react-router-dom";
import { motion } from 'framer-motion';
export const Category = () => {

    const [params, setSearchParams] = useSearchParams();
    const [currentIndex, setCurrentIndex] = useState(0);

    // on standard request all images



    const onClick = (value:string, i:number) => {
        setCurrentIndex(i)
        params.set('filter', value);
        setSearchParams(params)
    };

    const categories = [['All', 'all'], ['Milks & Dairies ', 'milks & dairies'], ['Beverages','beverages'], ['Vegetables & Fruits', 'vegetables & fruits'],['Meats & Seafood', 'meats & seafood']]
    return (<section className='section-category'>

        <h2 className='popular-header'> Popular Products</h2>
        <ul className='category-list'>
            {categories.map((category:string[], index) => <motion.li key={index} initial={{y:0}} animate={currentIndex === index ? {y:-5} : {y:0}} className={`${currentIndex === index && 'active'}`} onClick={() => onClick(category[1], index)}>{category[0]}</motion.li>)}
        </ul>

    </section>)
}