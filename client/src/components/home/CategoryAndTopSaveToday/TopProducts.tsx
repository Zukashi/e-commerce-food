import React, {useEffect, useState} from 'react';
import {useQuery} from "react-query";
import {useAxiosPrivate} from "../../../hooks/use-axios-private";
import {AxiosInstance} from "axios";
import './scss/top-products.scss'
import {useSearchParams} from "react-router-dom";
import {Product} from "../../../types/product";
import {OneProduct} from "./OneProduct";
import {AnimatePresence, motion, useAnimate, usePresence} from 'framer-motion';

const fetchProducts = async (axios:AxiosInstance, params:URLSearchParams):Promise<Product[]> => {
    // If params are default which means that they are not picked and filter query string is nullish then fetch all
    const res = await  axios.get(`product/all?${params.get('filter') === null ? 'filter=all' : params}`);
    return res.data
}

export const TopProducts = () => {
    const axiosPrivate = useAxiosPrivate();
    const [params, setSearchParams] = useSearchParams();
    const [loading ,setLoading] = useState(true)
    const {data, refetch, isLoading, isRefetching, } = useQuery('products', () => fetchProducts(axiosPrivate, params));
    useEffect(() => {
        params.set('filter', 'all')
        setSearchParams(params);
        refetch()
    }, [])
    useEffect(() => {
        console.log(333)
        void refetch();
    }, [params.get('filter')]);
    if(isRefetching){
        return <motion.section className='top-products'></motion.section>
    }
    console.log(isLoading)
    return (



        <motion.section className='top-products'
      >
            {data?.map((product) => <OneProduct framerKey={params} key={product.id} product={product}></OneProduct>)}


        </motion.section>
   )
}