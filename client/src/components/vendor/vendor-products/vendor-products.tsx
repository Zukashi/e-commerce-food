import React from 'react';
import {useAxiosPrivate} from "../../../hooks/use-axios-private";
import {useQuery} from "react-query";
import {AxiosInstance} from "axios";
import {Loader} from "../../loader/Loader";
import {Product} from '../../../types/product';

export const fetchVendorProducts = async (axios: AxiosInstance): Promise<Product[]> => {
    const data = await axios.get('vendor/products') as Product[]
    return data
}
export const VendorProducts = () => {
    const axiosPrivate = useAxiosPrivate();
    const {data, isLoading} = useQuery('vendor/products',
        () => fetchVendorProducts(axiosPrivate)
    )
    if (isLoading) {
        return <Loader/>
    }
    return (<>


    </>)
}