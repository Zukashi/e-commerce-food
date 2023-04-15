import React from 'react';
import './register.scss'
import {FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField} from "@mui/material";
import {SubmitHandler, useForm} from "react-hook-form";
import {useAxiosPrivate} from "../../hooks/use-axios-private";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export interface Register {
    username:string,
    email:string,
    password:string,
    confirm_password:string;
    role: 'customer' | 'vendor'
}
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {useNavigate} from "react-router-dom";

const schema = yup.object().shape({

    email: yup.string().email().required(),
    username: yup.string().min(8).max(20).required(),
    password: yup.string().min(8).max(20).required(),
    confirm_password: yup.string().min(8, 'confirm password must be at least 8 characters long').max(20, 'confirm password can be at most 20 characters long').required('Confirm Password is a required field'),
});
export const Register = () => {
    const {register, handleSubmit, formState:{errors}} = useForm<Register>({
        resolver:yupResolver(schema)
    });
    const axiosPrivate = useAxiosPrivate()
    type registerType = "username" | "email" | "password" | "confirm_password"
    const navigate = useNavigate()
    const labels = [['Username', 'username'], ['Email', 'email'], ['Password', 'password'], ['Confirm Password', 'confirm_password']]
    const sendForm:SubmitHandler<Register> = async (data) => {
               try{
                   const response =await  axiosPrivate.post('auth/register', data);
                   toast.success(response.data, {
                       position:"top-right",
                       theme:'dark'
                   })
                   navigate('/login')
               }catch(e: any){
                   toast.error(e.response.data.message, {
                       position:"top-right",
                       theme:'dark'
                   })
               }

    };
    return (<>

    <section className='register-section'>
            <div className="image-container">
                <img color='register-image' src="https://themes.pixelstrap.com/fastkart/assets/images/inner-page/sign-up.png" alt="image showing woman touching big phone indicating authentication"/>
            </div>
            <div className='bg-form'>
                    <div className='form-box'>
                            <h3>Create New Account</h3>
    <form className='register-form' onSubmit={handleSubmit(sendForm)} autoComplete={'off'}>
            {labels.map((label,i) => <span key={label[1]}><TextField type={i > 1 ? 'password' : 'text' }  {...register(label[1] as registerType)}  label={label[0]} variant="outlined"/><p className='error-message'>{errors[(label[1] as registerType)]?.message} </p></span>)}

            <FormControl>
                    <FormLabel id="demo-radio-buttons-group-label">Who are you</FormLabel><RadioGroup aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="customer"
                        name="radio-buttons-group"
                    >
                            <FormControlLabel {...register('role')} value="customer" control={<Radio />} label="I am a customer" />
                            <FormControlLabel  {...register('role')}  value="vendor" control={<Radio />} label="I am a vendor" />

                    </RadioGroup>
            </FormControl>
        <button type={"submit"}  className='submit-button'>Submit & Register </button>
    </form>

                    </div>
            </div>
    </section>
</>)
}