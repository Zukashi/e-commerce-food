
import React from 'react';


export const VendorDashboard = () => {
    return (<>


        <div className='products-amount'>
            <div className='content'>
                <h3 className='product'>PRODUCTS</h3>
                <h3 className='amount'>333</h3>
            </div>
        </div>
        <div className='products-amount orders'>
            <div className='content'>
                <h3 className='product'>ORDERS</h3>
                <h3 className='amount'>56 / Day</h3>
            </div>
        </div>
        <div className='products-amount earnings'>
            <div className='content'>
                <h3 className='product'>EARNINGS</h3>
                <h3 className='amount'>$56/ Day</h3>
            </div>
        </div>
        <div className='products-amount sales'>
            <div className='content'>
                <h3 className='product'>SALES</h3>
                <h3 className='amount'>550 / Mo</h3>
            </div>
        </div>

    </>)
}