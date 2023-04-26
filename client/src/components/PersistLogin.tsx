import {Outlet, useLocation, useNavigate} from "react-router-dom";
import React, { useState, useEffect } from "react";

import {useDispatch, useSelector} from "react-redux";
import {useAxiosPrivate} from "../hooks/use-axios-private";
import {setUser} from "../redux/userSlice";
import {Loader} from "./loader/Loader";
import {RootState} from "../redux/store/store";
import {Root} from "react-dom/client";

export  const RefreshUserDataOnEveryRequest = () => {
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation()
    const axiosPrivate = useAxiosPrivate();
    const {loading} = useSelector((root:RootState) => root.user)
    // @ts-ignore
    useEffect(() => {
        let isMounted = true;

        const verifyRefreshToken = async () => {
            try {
                const res = await axiosPrivate.get(`auth/refresh`);
                console.log(res.data)
                dispatch(setUser({
                    user:res.data,
                    isAuthenticated:true,
                }));
                console.log(res.data)
            }
            catch(e){
                // navigate('/login', {
                //     state:location.pathname
                // })
            }
            finally {
                isMounted && setIsLoading(false);
            }
        }
        void verifyRefreshToken()

        return () => isMounted = false;
    }, []);
    console.log(loading)
    useEffect(() => {
        console.log(`isLoading: ${isLoading}`)

    }, [isLoading])
    return (
        <>

            { isLoading || loading ? <Loader/> : <>
                <Outlet/></>}
        </>
    )
}


