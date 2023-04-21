import React, {useState} from 'react';
import {useDispatch} from "react-redux";
import {setSubImageReducer} from "../../../redux/vendor-uploads";

export const  OneSubImage = () => {
    const [image, setImage] = useState('')
    const dispatch = useDispatch();
    const onImageChange = async (e:React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files && e.target.files[0]){
            const formData = new FormData();
            console.log(e.target.files[0])
            // const r = await fetch(URL.createObjectURL(e.target.files[0]));
            // formData.append("image", await r.blob());
            console.log(formData)
            console.log(123)
            dispatch(setSubImageReducer(URL.createObjectURL(e.target.files[0])))

            setImage(URL.createObjectURL(e.target.files[0]))
        }
    }
    return (<>

           <div className='main-img-container sub-img-container'>
               {image ? <img width={'100%'} src={image} alt="123"/> : <div className='main-img-placeholder sub-image'>
                   <div className='text-inside-placeholder-container'>
                       <div className='dimensions-container sub-image'>
                           <p>765 X 850</p>
                       </div>
                   </div>
               </div>}

                   <div className='icon-edit-container sub-image' style={{width:'25px', height:'25px'}}>
                       <input type="file" className="file-input" onChange={onImageChange}/>
                       <img src="https://cdn-icons-png.flaticon.com/512/2356/2356780.png" width={'15px'} alt="edit icon"/>
                   </div>


       </div></>)
}