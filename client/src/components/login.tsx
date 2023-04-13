import {useForm} from "react-hook-form";
import {useAxiosPrivate} from "../hooks/use-axios-private";
import React from "react";

export const Login = () => {
    const {register, handleSubmit, } = useForm()
    const axios = useAxiosPrivate();
    const onSubmit = async (data:any) => {
        console.log(1234)
        const {data:data2} = await axios.post('auth/login', data);
        console.log(data2)
    }
    return (<>
        <form onSubmit={handleSubmit(onSubmit)}>
            <input type="text" {...register('username')} placeholder={'username'}/>
            <input type="text" {...register('email')} placeholder={'email'}/>
            <input type="text" {...register('password')} placeholder={'password'}/>
            <button type={"submit"}>submit</button>
        </form>
    </>)
}