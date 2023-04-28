import React, {useEffect} from 'react';
import {useQuery} from "react-query";
import {useAxiosPrivate} from "../../../hooks/use-axios-private";
import {AxiosInstance} from "axios";
import './scss/top-products.scss'
import {useSearchParams} from "react-router-dom";
import {Product} from "../../../types/product";
const fetchProducts = async (axios:AxiosInstance, params:URLSearchParams| null):Promise<Product[]> => {
    console.log(params)
    const res = await  axios.get(`product/all?${params}`);
    return res.data
}

export const TopProducts = () => {
    const axiosPrivate = useAxiosPrivate();
    const [params] = useSearchParams();
    const {data, refetch} = useQuery('products', () => fetchProducts(axiosPrivate, params));
    console.log(data)
    useEffect(() => {
        void refetch()
    }, [params])
    return (<section className='top-products'>

    </section>)
}