import React, {useState} from 'react';
import './vendor-uploads.scss'
import {SubImages} from "./sub-images";
import {UploadsForm} from "./UploadsForm";

export const VendorUploads = () => {
    const [isPicked, setIsPicked] = useState(false)
    return (<section className='vendor-uploads-section'>
        <div className='main-img-container'>
            {isPicked ? <img width={'100%'} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8UaO8zvh5DjMIZ3C-jUQyIdtnCH9VUBvPRCZIbf60YQ&s" alt=""/> : <div className='main-img-placeholder'>
                <div className='text-inside-placeholder-container'>
                    <div className='dimensions-container'>
                        <p>765 X 850</p>
                    </div>
                    <p className='desc'>Please choose an image according to the aspected ratio</p>
                </div>
            </div>}
            <div className='icon-edit-container'>
                <img src="https://cdn-icons-png.flaticon.com/512/2356/2356780.png" width={'18px'} alt="edit icon"/>
            </div>
        </div>
        <SubImages/>

        <UploadsForm/>

    </section>)
}