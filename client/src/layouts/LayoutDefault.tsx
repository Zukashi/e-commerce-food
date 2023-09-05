import React, {useEffect, useState} from 'react';
import {Nav} from "../components/nav/Nav";
import {Outlet} from "react-router-dom";
import {motion, useScroll, useTransform, useViewportScroll} from 'framer-motion';


export const LayoutDefault = () => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [isTop, setIsTop] = useState(true);

    const handleScroll = () => {
        setIsTop(window.pageYOffset === 0);
    };

    const handleButtonClick = () => {
        const scrollToTop = () => {
            const currentPosition = window.pageYOffset;
            if (currentPosition > 0) {
                // increasing the number currentPosition divides slows down the animation
                window.scrollTo(0, currentPosition - currentPosition / 16);
                requestAnimationFrame(scrollToTop);
            }
        };
        scrollToTop();
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    useEffect(() => {
        const updatePosition = () => {
            setScrollPosition(window.pageYOffset);
        };

        window.addEventListener("scroll", updatePosition);

        return () => window.removeEventListener("scroll", updatePosition);
    }, []);
    return (<>
        <Nav/>

        <Outlet/>
       <motion.a
            className="scroll-to-top"

            onClick={handleButtonClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: isTop ? 0 : 1 }}
            transition={{ duration: 0.2 }}

            style={{position:"fixed", right:"2rem", bottom:"2rem", color:"black", border:"2px solid black", borderRadius:"50%", width:"30px", height:"30px", display:"flex", justifyContent:"center", alignItems:"center", cursor:"pointer" }}  ><i className="fa-solid fa-arrow-up"></i></motion.a>

    </>)
}