import React, {useEffect, useState} from 'react';
import { useForm} from "react-hook-form";
import {useAxiosPrivate} from "../hooks/use-axios-private";
import {useQuery} from "react-query";
import {AxiosInstance} from "axios";
import {Loader} from "../components/loader/Loader";
type Inputs = {
    test:string;
}
export const getImages = async (axiosPrivate:AxiosInstance) => {
    return (await axiosPrivate.get('product-image/all')).data

}
export const  Shop = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>();
    const [currentImage, setCurrentImage] = useState<string>('');
    const axiosPrivate = useAxiosPrivate()
    // const {amount} = useSelector((root:RootState) => root);
    const {isLoading, data} = useQuery('image/all', () => getImages(axiosPrivate))
    const onSubmit = async (data:any) => {
        const formData = new FormData();
        if(!data.test[0])  throw new Error();
        console.log(data.test[0])
        formData.append("image", data.test[0]);
        console.log(formData)
        const res = await axiosPrivate.post('product-image/one', formData, {
            headers:{
                'Content-type':'multipart/form-data'
            }
        });
    }
    useEffect(() => {
        (async () => {
            const response = await axiosPrivate.get('product-image/all');
            console.log(response.data)
            setCurrentImage(response.data[0])
        })()
    }, []);
    if(isLoading){
        return <Loader/>
    }
    return(<>
        <form onSubmit={handleSubmit(onSubmit)}>
            <input type="file" {...register("test")}/>
            <button type='submit'></button>
        </form>
        <img src={`${(data[0] as any)?.imageUrl}`} alt="product img"/>

    </>)
}