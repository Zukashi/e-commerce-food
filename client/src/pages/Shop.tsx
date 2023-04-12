import React, {useEffect} from 'react';
import axios from 'axios';
import {SubmitHandler, useForm} from "react-hook-form";
type Inputs = {
    test:string;
}
export const  Shop = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>();
    // const {amount} = useSelector((root:RootState) => root);
    useEffect(() => {
        (async () => {
            const response = await axios.get('http://localhost:3000/product/all');
            console.log(response)
        })()
    }, [])
    const onSubmit = async (data:any) => {
        console.log('test')
        const formData = new FormData();
        console.log(watch('test'))
        console.log(data.test)
        if(!data.test[0])  throw new Error()
        formData.append("image", data.test[0]);
        const res = await axios.post('http://localhost:3000/product', formData, {
            headers:{
                'Content-type':'multipart/form-data'
            }
        });
    }
    return(<>
        <form onSubmit={handleSubmit(onSubmit)}>
            <input type="file" {...register("test")}/>
            <button type='submit'></button>
        </form>

    </>)
}