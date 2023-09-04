import React from 'react';
import {TextField} from "@mui/material";
import {motion} from "framer-motion";
import {useInView} from "react-intersection-observer";
import {registerType, UploadProductFormValues} from "./UploadsForm";
import {FieldErrors, UseFormRegister} from "react-hook-form";

export const  OneFormItem = ({label,i, errors, register}:{label:string[], i :number,register: UseFormRegister<UploadProductFormValues>, errors:FieldErrors<UploadProductFormValues> }) => {
    const animationVariants = {
        hidden:{
            opacity:0,
            y:30
        },
        visible:{
            opacity:1,
            y:0,

        }
    }
    const { ref, inView } = useInView({
        /* Optional options */
        threshold: 0.2 // Triggers when 50% of the element is visible
    });
    return (<motion.span ref={ref}
                         animate={inView ? "visible" : "hidden"}
                         transition={{ duration: 0.4, delay:i * 0.1 }}
                         variants={animationVariants}

                         key={label[1]}><TextField   {...register(label[1] as registerType)} type={i > 0 && i < 3 ? 'number' : 'text'} label={label[0]} onKeyDown={(event) => {
        if (!/[0-9]/.test(event.key) && (i > 0 && i < 3)) {
            event.preventDefault();
        }

    }} variant="outlined"/><p className='error-message'>{errors[(label[1] as registerType)]?.message} </p></motion.span>)
}