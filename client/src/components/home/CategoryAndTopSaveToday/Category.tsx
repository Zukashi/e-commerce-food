import React, {useState} from 'react';
import './scss/category.scss'
import {useSearchParams} from "react-router-dom";
export const Category = () => {

    const [params, setSearchParams] = useSearchParams();
    const [currentIndex, setCurrentIndex] = useState(0)
    const onClick = (value:string, i:number) => {
        setCurrentIndex(i)
        params.set('filter', value.toLowerCase());
        setSearchParams(params)
    }
    const categories = ['All', 'Milks & Dairies', 'Coffee & Teas']
    return (<section className='section-category'>

        <h2 className='popular-header'>Popular Products</h2>
        <ul className='category-list'>
            {categories.map((category:string, index) => <li onClick={() => onClick(category, index)}>{category}</li>)}
        </ul>

    </section>)
}