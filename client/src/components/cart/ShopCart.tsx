
import React from 'react';
import {useQuery} from "react-query";
import {useAxiosPrivate} from "../../hooks/use-axios-private";
import {AxiosInstance} from "axios";
import {Product} from "../../types/product";
import {Loader} from "../loader/Loader";
import { OneProductInShopCart } from './OneProductInShopCart';
import './cart-table.scss';

const fetchCart = async (axios:AxiosInstance):Promise<Product[]> => {
    const res = await axios.get('cart');
    return res.data
}
export const ShopCart = () => {
    const axiosPrivate = useAxiosPrivate();
    const {data:products, isLoading} = useQuery('cart', () => fetchCart(axiosPrivate))
    if(isLoading){
        return <Loader/>
    }
    return(<><section style={{backgroundColor:'#fff'}}>
        <div className='table-container'><div className='product-table'> <table> <tbody className='table-body'>{products?.map((product) => <tr key={product.id} className='product-row'><OneProductInShopCart product={product}key={product.id}/></tr>)}</tbody></table></div></div>

    </section>
    </>)
}