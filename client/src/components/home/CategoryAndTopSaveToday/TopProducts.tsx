import React, {useEffect, useState} from 'react';
import {useQuery} from "react-query";
import {useAxiosPrivate} from "../../../hooks/use-axios-private";
import {AxiosInstance} from "axios";
import './scss/top-products.scss'
import {useSearchParams} from "react-router-dom";
import {Product} from "../../../types/product";
import {OneProduct} from "./OneProduct";
import {AnimatePresence, motion, useAnimate, usePresence} from 'framer-motion';
import {Loader} from "../../loader/Loader";
const fetchProducts = async (axios:AxiosInstance, params:URLSearchParams):Promise<Product[]> => {
    console.log(params.get('filter'))
    const res = await  axios.get(`product/all?${params}`);
    return res.data
}

export const TopProducts = () => {
    const axiosPrivate = useAxiosPrivate();
    const [params] = useSearchParams();
    const [loading ,setLoading] = useState(true)
    const {data, refetch, isLoading, isRefetching, } = useQuery('products', () => fetchProducts(axiosPrivate, params));
    useEffect(() => {

        void refetch();
    }, [params]);
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