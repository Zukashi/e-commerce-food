import React, {useEffect, useState} from 'react';
import {useQuery} from "react-query";
import {useAxiosPrivate} from "../../../hooks/use-axios-private";
import {AxiosInstance} from "axios";
import './scss/top-products.scss'
import {useSearchParams} from "react-router-dom";
import {Product} from "../../../types/product";
import {OneProduct} from "./OneProduct";
import {AnimatePresence, motion, useAnimate} from 'framer-motion';
const fetchProducts = async (axios:AxiosInstance, params:URLSearchParams| null):Promise<Product[]> => {
    console.log(params)
    const res = await  axios.get(`product/all?${params}`);
    return res.data
}

export const TopProducts = () => {
    const axiosPrivate = useAxiosPrivate();
    const [params] = useSearchParams();
    const [scope, animate] = useAnimate();
    const [boolean, setBoolean] = useState(false)
    const {data, refetch} = useQuery('products', () => fetchProducts(axiosPrivate, params));
    console.log(data)
    useEffect(() => {
        setBoolean((prevState ) => !prevState)
        void refetch()
    }, [params]);

    return (<AnimatePresence >
        <motion.section ref={scope} className='top-products' >
            {data?.map((product) => <OneProduct key={product.id} product={product}></OneProduct>)}
        </motion.section>
    </AnimatePresence>)
}