import React, {useState} from 'react'
import './sub-imgs.scss'
import {OneSubImage} from "./one-sub-image";
export const SubImages = () => {
    const [isPicked, setIsPicked] = useState(false)

    return (<>

        <div className='sub-images-container'>
            <div className='sub-images'>
                <OneSubImage/>
                <OneSubImage/>
                <OneSubImage/>
                <OneSubImage/>
                <OneSubImage/>
                <OneSubImage/>
            </div>
        </div>

    </>)
}