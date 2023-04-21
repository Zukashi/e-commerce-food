import React, {useState} from 'react';
import './vendor-uploads.scss'
import {SubImages} from "./sub-images";
import {UploadsForm} from "./UploadsForm";
import {useDispatch} from "react-redux";
import { setMainImageReducer} from "../../../redux/vendor-uploads";

export type FormValues = {
    img:FileList
}

export const VendorUploads = () => {
    const [image, setImage] = useState<null | string>(null);
    const dispatch = useDispatch()

    const onImageChange = async (e:React.ChangeEvent<HTMLInputElement>) => {
            if(e.target.files && e.target.files[0]){
                const formData = new FormData();
                console.log(e.target.files[0])
                // const r = await fetch(URL.createObjectURL(e.target.files[0]));
                // formData.append("image", await r.blob());
                console.log(formData)
                dispatch(setMainImageReducer(URL.createObjectURL(e.target.files[0])))

                setImage(URL.createObjectURL(e.target.files[0]))
            }
    }
    console.log(image)
    return (<section className='vendor-uploads-section'>
        <div className='main-img-container'>
            {image ? <img width={'100%'} src={image} alt="main image"/> : <div className='main-img-placeholder'>
                <div className='text-inside-placeholder-container'>
                    <div className='dimensions-container'>
                        <p>765 X 850</p>
                    </div>
                    <p className='desc'>Please choose an image according to the aspected ratio</p>
                </div>
            </div>}
            <div className='icon-edit-container' >
                <input type="file" className="file-input" onChange={onImageChange} />
                <img src={"https://cdn-icons-png.flaticon.com/512/2356/2356780.png"} width={'18px'} alt="edit icon"/>
            </div>
        </div>

        <SubImages/>

        <UploadsForm/>

    </section>)
}