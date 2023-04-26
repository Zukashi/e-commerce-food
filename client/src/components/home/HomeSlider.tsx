import React from 'react';
import {FormControlLabel, Radio, TextField} from "@mui/material";
import {useForm} from "react-hook-form";
import './HomeSlider.scss'
export const HomeSlider = () => {
    const {handleSubmit, register} = useForm<{
        email:string
    }>()
    return (<>
        <div className='slider-container'><div className='hero'>

            <div className='slider'>
                <div className='slider-content'>
                    <h2>Don't miss amazing grocery deals</h2>

                    <p>Sign up for the daily newsletter</p>


                    <form className={'form'} >
                        <TextField className='input'   {...register('email')}  label='Your email address' variant="outlined"/>
                        <button className='submit-button newsletter'>Subscribe</button>
                    </form>
                    <ul className='dots'>
                        <li className='dott'>1</li>
                        <li className='dott'>2</li>
                    </ul>
                </div>
            </div>
        </div>
        </div>

    </>)
}