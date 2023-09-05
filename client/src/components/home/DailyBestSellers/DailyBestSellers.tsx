import React, {useCallback, useEffect} from 'react';
import './scss/DailyBestSellers.scss'
import {Rating} from "@mui/material";
import {motion} from "framer-motion";
import {useQuery} from "react-query";
import {useAxiosPrivate} from "../../../hooks/use-axios-private";
import {AxiosInstance} from "axios";
import {Product} from "../../../types/product";
import {Loader} from "../../loader/Loader";
import {OneBestSeller} from "./OneBestSeller";
import useEmblaCarousel from "embla-carousel-react";
const fetchBestSellers = async (axios:AxiosInstance):Promise<Product[]> => {
    const res = await axios.get('product/best');
    return res.data
}
export const DailyBestSellers  = () => {
    const axiosPrivate = useAxiosPrivate();
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
    const {data, refetch, isLoading, isRefetching,isFetching } = useQuery('products/best', () => fetchBestSellers(axiosPrivate));
    const scrollPrev = useCallback(() => {    if (emblaApi) emblaApi.scrollPrev()  }, [emblaApi])
    const scrollNext = useCallback(() => {    if (emblaApi) emblaApi.scrollNext()  }, [emblaApi])
    if(!data){
        return <Loader/>
    }
    return <>
        <h2 className='best-sellers-header'>Daily Best Sellers</h2>
        <div className="embla container__embla" >     <div className="embla__viewport" ref={emblaRef}>   <div className="embla__container">
        {data.map((product) => <OneBestSeller key={product.id} product={product}/>)}
        </div>
        </div>
            <button className="embla__prev embla__button" onClick={scrollPrev}>
                <i className="fa-solid fa-arrow-left"></i>
            </button>
            <button className="embla__next embla__button" onClick={scrollNext}>
                <i className="fa-solid fa-arrow-right"></i>
            </button>
        </div>
    </>
}