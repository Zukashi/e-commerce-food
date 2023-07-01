import React from 'react';
import './scss/DailyBestSellers.scss'
import {Rating} from "@mui/material";
import {motion} from "framer-motion";
import {useQuery} from "react-query";
import {useAxiosPrivate} from "../../../hooks/use-axios-private";
import {AxiosInstance} from "axios";
import {Product} from "../../../types/product";
import {Loader} from "../../loader/Loader";
import {OneBestSeller} from "./OneBestSeller";
const fetchBestSellers = async (axios:AxiosInstance):Promise<Product[]> => {
    const res = await axios.get('product/best');
    return res.data
}
export const DailyBestSellers  = () => {
    const axiosPrivate = useAxiosPrivate()
    const {data, refetch, isLoading, isRefetching,isFetching } = useQuery('products/best', () => fetchBestSellers(axiosPrivate));
    if(!data){
        return <Loader/>
    }
    return <>
        <h2 className='best-sellers-header'>Daily Best Sellers</h2>
        {data.map((product) => <OneBestSeller key={product.id} product={product}/>)}
    </>
}