import {useForm} from "react-hook-form";
import {useAxiosPrivate} from "../hooks/use-axios-private";
import React from "react";
import {FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField} from "@mui/material";
import {yupResolver} from "@hookform/resolvers/yup";
import {Register} from "./register/register";
import * as yup from "yup";
import {toast} from "react-toastify";

const schema = yup.object().shape({

    email: yup.string().email().required(),
    username: yup.string().min(8).max(20).required(),
    password: yup.string().min(8).max(20).required(),
});
export const Login = () => {
    const {register, handleSubmit, formState:{errors}} = useForm<Register>({
        resolver:yupResolver(schema)
    });
    const axios = useAxiosPrivate();
    const onSubmit = async (data:any) => {
        console.log(1234)
        try{
            const {data:data2} = await axios.post('auth/login', data);
        }catch(e:any){
            toast.error(e.response.data.message, {
                position:"top-right",
                theme:'dark'
            })
        }
    }

    type registerType = "username" | "email" | "password"
    const labels = [['Username or Email', 'usernameOrEmail'], ['Password', 'password']]
    return (<>

        <section className='register-section'>

            <div className='bg-form'>
                <div className='form-box'>
                    <h3>Login</h3>
                    <form className='register-form' onSubmit={handleSubmit(onSubmit)} autoComplete={'off'}>
                        {labels.map((label,i) => <span key={label[1]}><TextField type={i > 1 ? 'password' : 'text' }  {...register(label[1] as registerType)}  label={label[0]} variant="outlined"/><p className='error-message'>{errors[(label[1] as registerType)]?.message} </p></span>)}


                        <button type={"submit"}  className='submit-button'>Login </button>
                    </form>

                </div>
            </div>
        </section>
    </>)
}