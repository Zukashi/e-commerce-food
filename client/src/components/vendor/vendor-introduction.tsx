import React from 'react';
import {NavLink} from 'react-router-dom';
import './vendormain.scss'

export const VendorIntroduction = () => {
    return <>


        <div className='vendor-introduction'>
            <div className='vendor-introduction-content-container'>
                <img src="" alt=""/>
                <img src="" alt="   "/>
                <div className='vendor-nav'>
                    <NavLink to='dashboard'>Dashboard</NavLink>
                    <NavLink to='products'>Products</NavLink>
                    <NavLink to='orders'>Orders</NavLink>
                    <NavLink to='uploads'>Uploads</NavLink>
                    <NavLink to='settings'>Settings</NavLink>
                </div>
            </div>
        </div>


    </>
}