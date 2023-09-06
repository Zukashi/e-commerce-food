import React, {useCallback, useEffect} from 'react';
import './scss/DailyBestSellers.scss'
import {Rating} from "@mui/material";
import {motion, TargetAndTransition, VariantLabels} from "framer-motion";
import {useQuery} from "react-query";
import {useAxiosPrivate} from "../../../hooks/use-axios-private";
import {AxiosInstance} from "axios";
import {Product} from "../../../types/product";
import {Loader} from "../../loader/Loader";
import {OneBestSeller} from "./OneBestSeller";
import useEmblaCarousel from "embla-carousel-react";

const fetchBestSellers = async (axios: AxiosInstance): Promise<Product[]> => {
    const res = await axios.get('product/best');
    return res.data
}
export const DailyBestSellers = () => {
    const axiosPrivate = useAxiosPrivate();
    const buttonTransition: VariantLabels | TargetAndTransition | undefined = {
        transition: {duration: 0.2},
        backgroundColor: '#3bb77e', opacity: 1
    }

    const [emblaRef, emblaApi] = useEmblaCarousel({loop: true,})
    const {
        data,
    } = useQuery('products/best', () => fetchBestSellers(axiosPrivate));
    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev()
    }, [emblaApi])
    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext()
    }, [emblaApi])
    if (!data) {
        return <Loader/>
    }
    return <>
        <h2 className='best-sellers-header'>Daily Best Sellers</h2>
        <section className='daily-best-sellers'>
            <div className="embla container__embla">
                <div className="embla__viewport" ref={emblaRef}>
                    <div className="embla__container">
                        {data.map((product) => <OneBestSeller key={product.id} product={product}/>)}
                    </div>
                </div>
                <motion.button className="embla__prev embla__button" whileHover={buttonTransition} onClick={scrollPrev}>
                    <i className="fa-solid fa-arrow-left"></i>
                </motion.button>
                <motion.button whileHover={buttonTransition} className="embla__next embla__button" onClick={scrollNext}>
                    <i className="fa-solid fa-arrow-right"></i>
                </motion.button>
            </div>
        </section>
    </>
}