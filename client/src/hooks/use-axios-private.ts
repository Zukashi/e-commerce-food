import axios, { axiosPrivate } from "../api/axios";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {setLoading, setUser} from "../redux/userSlice";
import {useLocation, useNavigate} from "react-router-dom";
import {Loader} from "../components/loader/Loader";


export const useAxiosPrivate = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {

        const requestIntercept = axiosPrivate.interceptors.request.use(
            config => {

                return config;
            }, (error) => Promise.reject(error)
        );

        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 401 && !prevRequest?.sent) {
                    dispatch(setLoading(true))
                    prevRequest.sent = true;
                   try{
                       const res = await axios(`auth/refresh`,{
                           method:'GET',
                           withCredentials:true
                       });

                       console.log(88)
                       dispatch(setUser({
                           user:res.data.user,
                           isAuthenticated:true,
                       }))

                       return axiosPrivate(prevRequest);
                   }catch(e){
                       navigate('/login', {state:{
                           from:location
                           }

                       })
                   }finally{
                       dispatch(setLoading(false))
                   }
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        }
    }, [])
    return axiosPrivate;
}
