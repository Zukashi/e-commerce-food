import React from 'react';
import {Outlet} from "react-router-dom";
import {VendorIntroduction} from "../components/vendor/vendor-introduction";

export const VendorLayout = () => {
    return (<>
        <section className='vendor-profile-container'>
            <div className='vendor-profile'>
        <VendorIntroduction/>
        <Outlet/>
            </div>
        </section>
    </>)
}