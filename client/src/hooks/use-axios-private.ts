import { axiosPrivate } from "../api/axios";
import { useEffect } from "react";
import axios from "axios";
import {useDispatch} from "react-redux";
import {apiUrl} from "../config/api";
import {setUser} from "../redux/userSlice";


export const useAxiosPrivate = () => {
    const dispatch = useDispatch();
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
                    prevRequest.sent = true;
                    const res = await axios(`auth/refreshToken`,{
                        method:'PATCH',
                        withCredentials:true,
                    });
                    dispatch(setUser({
                        user:res.data.user,
                    }))

                    return axiosPrivate(prevRequest);
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