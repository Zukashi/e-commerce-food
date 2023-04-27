import React, {useRef, useState} from 'react';
import {TextField} from "@mui/material";
import {Slides} from "./HomeSlider";
import {SubmitHandler, useForm} from "react-hook-form";
import './HomeSlider.scss';
import {AnimatePresence, motion} from 'framer-motion';
import {useAxiosPrivate} from "../../hooks/use-axios-private";
import {toast} from "react-toastify";
export const ImageSlider = ({slides}:{slides:Slides}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const containerRef = useRef(null);
    const {handleSubmit, register} = useForm<{
        email:string
    }>();
    const axiosPrivate = useAxiosPrivate();
    const handleNextSlide = () => {
        setCurrentIndex((currentIndex + 1) % slides.length);
    };

    const handlePrevSlide = () => {
        setCurrentIndex(currentIndex === 0 ? slides.length - 1 : currentIndex - 1);
    };

    const setupNewsletter:SubmitHandler<{email:string}> = async (data) => {
        await axiosPrivate.post('/newsletter', data);
        toast.success("Thank you for subscribing to our newsletter", {
            theme:"dark",
        })

    }

    return (<div className='slide' ref={containerRef} >
        <AnimatePresence mode={"popLayout"}  >
        <motion.div    key={currentIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{duration:.15}}
                      className='hero' style={{backgroundImage:`url("${slides[currentIndex].img}")`}}
                      drag="x" // enable horizontal drag
                      dragConstraints={{right:0, left:0}} // constrain drag within slide container
                      dragTransition={{
                          bounceDamping:400
                      }}
                      onDragEnd={(event, info) => {
                          const { offset, velocity } = info;
                          if (offset.x > 100 || velocity.x > 500) {
                              handlePrevSlide()

                          } else if (offset.x < -100 || velocity.x < -500) {
                              handleNextSlide()
                          }
                      }} // change slide on drag end
        >


            <div className='arrow-left' onClick={handlePrevSlide}>
                <i className="fa-solid fa-chevron-left"></i>
            </div>
            <div className='arrow-right' onClick={handleNextSlide}
            >
                <i className="fa-solid fa-chevron-right"></i>
            </div>
            <div className='slider'>
                <div className='slider-content'>
                    <h2>{slides[currentIndex].header}</h2>

                    <p>{slides[currentIndex].text}</p>


                    <form className={'form'} autoComplete={'off'} onSubmit={handleSubmit(setupNewsletter)} >
                        <TextField className='input'   {...register('email')}  label='Your email address' variant="outlined"/>
                        <button className='submit-button newsletter' type={"submit"}>Subscribe</button>
                    </form>
                </div>
            </div>

            <div className='slider-dots'>
                {slides.map((slide,slideIndex) => {
                    return <i className={`${slideIndex === currentIndex && 'active'} fa-solid fa-circle`} key={slideIndex} onClick={() => setCurrentIndex(slideIndex)}></i>
                })}
            </div>
        </motion.div>
        </AnimatePresence>
    </div>)
}