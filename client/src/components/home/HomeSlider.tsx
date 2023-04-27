import React from 'react';
import {FormControlLabel, Radio, TextField} from "@mui/material";
import {useForm} from "react-hook-form";
import './HomeSlider.scss';
import {ImageSlider} from "./ImageSlider";
import { motion, AnimatePresence } from "framer-motion"
export const slides = [
    {
        header:"Don't miss amazing grocery deals",
        text:'Sign up for the daily newsletter',
        img:'https://wp.alithemes.com/html/nest/demo/assets/imgs/slider/slider-1.png'

    },
    {
        header:'Fresh vegetables big discount',
        text:'Save up to 50% on your first order',
        img :'https://wp.alithemes.com/html/nest/demo/assets/imgs/slider/slider-2.png'
},
    {
        header:'Test 3',
        text:'Save up to 50% on your first order',
        img :'https://wp.alithemes.com/html/nest/demo/assets/imgs/slider/slider-2.png'
    }
]
export type Slides = typeof slides
export const HomeSlider = () => {

    return (<>
        <AnimatePresence>
        <div
            className='slider-container'><ImageSlider slides={slides}></ImageSlider>
        </div>
        </AnimatePresence>

    </>)
}