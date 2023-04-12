import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {SubmitHandler, useForm} from "react-hook-form";
type Inputs = {
    test:string;
}
export const  Shop = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>();
    const [currentImage, setCurrentImage] = useState<string>('')
    // const {amount} = useSelector((root:RootState) => root);
    const onSubmit = async (data:any) => {
        const formData = new FormData();
        if(!data.test[0])  throw new Error()
        formData.append("image", data.test[0]);
        const res = await axios.patch('http://localhost:3000/product-image/5f23eb0c-bc2f-4992-9403-fd0b12ea5376', formData, {
            headers:{
                'Content-type':'multipart/form-data'
            }
        });
    }
    useEffect(() => {
        (async () => {
            const response = await axios.get('http://localhost:3000/product-image/all');
            setCurrentImage(response.data[0])
        })()
    }, [onSubmit])

    return(<>
        <form onSubmit={handleSubmit(onSubmit)}>
            <input type="file" {...register("test")}/>
            <button type='submit'></button>
        </form>
        <img src={`${(currentImage as any).imageUrl}`} alt="product img"/>

    </>)
}