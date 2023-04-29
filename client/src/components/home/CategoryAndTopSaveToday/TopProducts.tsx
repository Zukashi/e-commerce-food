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
const fetchProducts = async (axios:AxiosInstance, params:URLSearchParams| null):Promise<Product[]> => {
    console.log(params)
    const res = await  axios.get(`product/all?${params}`);
    return res.data
}

export const TopProducts = () => {
    const axiosPrivate = useAxiosPrivate();
    const [params] = useSearchParams();

    const {data, refetch, isLoading} = useQuery('products', () => fetchProducts(axiosPrivate, params));
    console.log(data)
    useEffect(() => {
        void refetch();
    }, [params]);

    return (

        <AnimatePresence >

        <motion.section className='top-products'>
            {!isLoading ?
            data?.map((product) => <OneProduct framerKey={params} key={product.id} product={product}></OneProduct>)
                : <Loader/>}
        </motion.section>
    </AnimatePresence>)
}