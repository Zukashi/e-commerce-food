import {SubmitHandler, useForm} from "react-hook-form";
import {useAxiosPrivate} from "../../hooks/use-axios-private";
import React, {useEffect} from "react";
import {Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Radio, RadioGroup, TextField} from "@mui/material";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import './login.scss'
import {setPersist} from "../../redux/persistLogin";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store/store";
type Login  = {
    usernameOrEmail:string;
    password:string;
}
const schema = yup.object().shape({

    usernameOrEmail: yup.string().required(),
    password: yup.string().min(8).max(20).required(),

});
export const Login = () => {
    const {register, handleSubmit, formState:{errors}} = useForm<Login>({
        resolver:yupResolver(schema)
    });
    const {register:registerRemember, getValues} = useForm<{rememberMe:''}>();
    const navigate = useNavigate();
    const axios = useAxiosPrivate();
    const persist = useSelector((root:RootState) => root.persist);
    const dispatch = useDispatch()
    console.log(localStorage.getItem('refresh_token'))
    const onSubmit: SubmitHandler<Login> = async data => {


        try{
            console.log(data)
            const res = await axios.post('auth/login', {
                    password:data.password,
                ...(data.usernameOrEmail.includes('@') ? {email: data.usernameOrEmail} : {username:data.usernameOrEmail})
            });
            console.log(res.data)
            localStorage.setItem('persist', getValues('rememberMe') && 'true')
            localStorage.setItem('refresh_token', res.data.refreshToken)
            localStorage.setItem('access_token', res.data.accessToken)
            navigate('/')
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
                        <button type={"submit"}  className='submit-button login-button'>Login </button>
                    </form>

                </div>
            </div>
        </section>
    </>)
}