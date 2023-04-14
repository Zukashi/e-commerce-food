import React from 'react';
import './register.scss'
import {FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField} from "@mui/material";
import {SubmitHandler, useForm} from "react-hook-form";
import axios from '../../api/axios';
import {useAxiosPrivate} from "../../hooks/use-axios-private";
export interface Register {
    username:string,
    email:string,
    password:string,
    confirm_password:string;
}
export const Register = () => {
    const {register, handleSubmit, watch} = useForm<Register>();
    const axiosPrivate = useAxiosPrivate()
    type registerType = "username" | "email" | "password" | "confirm_password"

    const labels = [['Username', 'username'], ['Email', 'email'], ['Password', 'password'], ['Confirm Password', 'confirm_password']]
    const sendForm:SubmitHandler<Register> = async (data) => {
        console.log(data)
                const response =await  axiosPrivate.post('auth/register', data);
                console.log(response.request)
    };
    return (<>
    <section className='register-section'>
            <div className='bg-form'>
                    <div className='form-box'>
                            <h3>Create New Account</h3>
    <form className='register-form' onSubmit={handleSubmit(sendForm)} autoComplete={'off'}>
            {labels.map((label,i) => <TextField key={label[1]} {...register(label[1] as registerType)} id="outlined-basic" label={label[0]} variant="outlined"/>)}

            <FormControl>
                    <FormLabel id="demo-radio-buttons-group-label">Who are you</FormLabel><RadioGroup aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="customer"
                        name="radio-buttons-group"
                    >
                            <FormControlLabel value="customer" control={<Radio />} label="I am a customer" />
                            <FormControlLabel  value="vendor" control={<Radio />} label="I am a vendor" />

                    </RadioGroup>
            </FormControl>
        <button type={"submit"}  className='submit-button'>Submit & Register </button>
    </form>

                    </div>
            </div>
    </section>
</>)
}