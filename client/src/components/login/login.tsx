import {SubmitHandler, useForm} from "react-hook-form";
import {useAxiosPrivate} from "../../hooks/use-axios-private";
import React, {useEffect} from "react";
import {Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Radio, RadioGroup, TextField} from "@mui/material";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {toast} from "react-toastify";
import {useLocation, useNavigate} from "react-router-dom";
import './login.scss'


type Login  = {
    usernameOrEmail:string;
    password:string;
    role:string
}
const schema = yup.object().shape({

    usernameOrEmail: yup.string().required(),
    password: yup.string().min(8).max(20).required(),
    role:yup.string().required()

});
export const Login = () => {
    const {register, handleSubmit, formState:{errors}} = useForm<Login>({
        resolver:yupResolver(schema)
    });
    const {register:registerRemember, getValues} = useForm<{rememberMe:''}>();
    const navigate = useNavigate();
    const axios = useAxiosPrivate();
    const location = useLocation()
    console.log(location.state)
    useEffect(() => {
        // if user came here from different subsite then show this toast
        if(typeof location.state ==='string'){
            toast.warning('Log in to access that data',{
                position:"top-right",
                theme:'dark',
                autoClose:4000,
            })
        }
    }, [])
    const onSubmit: SubmitHandler<Login> = async data => {


        try{
            const res = await axios.post(`auth/login/${data.role}`, {
                    password:data.password,
                // depending on if field is username or email pick one
                ...(data.usernameOrEmail.includes('@') ? {email: data.usernameOrEmail} : {username:data.usernameOrEmail})
            });

            if(typeof location.state ==='string'){
                navigate(location.state)
            }else{
                navigate('/')
            }
            toast.success('Logged successfully', {
                position:"top-right",
                theme:'dark',
                autoClose:1500,
            })
        }catch(e:any){
            console.log(e)
            toast.error(e, {
                position:"top-right",
                theme:'dark'
            })
        }
    }

    type registerType = "usernameOrEmail" | "password"
    const labels = [['Username or Email', 'usernameOrEmail'], ['Password', 'password']]
    return (<>

        <section className='register-section login-section'>
            <div className="image-container">
                <img color='register-image' src="https://themes.pixelstrap.com/fastkart/assets/images/inner-page/log-in.png" alt="image showing man using laptop indicating authentication"/>
            </div>
            <div className='bg-form'>
                <div className='form-box'>
                    <h3>Login</h3>
                    <form className='login-form' onSubmit={handleSubmit(onSubmit)} autoComplete={'off'}>
                        {labels.map((label,i) => <span className='login-form-item' key={label[1]}><TextField type={i > 0 ? 'password' : 'text' }  {...register(label[1] as registerType)}  label={label[0]} variant="outlined"/><p className='error-message'>{errors[(label[1] as registerType)]?.message} </p></span>)}

                        <FormGroup className='remember-me' >
                            <FormControlLabel control={<Checkbox     {...registerRemember('rememberMe', {})}/>} label="Remember me" />

                        </FormGroup>
                        <FormControl>
                            <FormLabel id="demo-radio-buttons-group-label">Who are you</FormLabel><RadioGroup aria-labelledby="demo-radio-buttons-group-label"
                                                                                                                                                          defaultValue="customer"
                                                                                                                                                          name="radio-buttons-group"
                                                                    >
                            <FormControlLabel {...register('role')} value="customer" control={<Radio />} label="I am a customer" />
                            <FormControlLabel  {...register('role')}  value="vendor" control={<Radio />} label="I am a vendor" />

                        </RadioGroup>
                        </FormControl>
                        <button type={"submit"}  className='submit-button login-button'>Login </button>
                    </form>

                </div>
            </div>
        </section>
    </>)
}