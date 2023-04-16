import {Outlet, useNavigate} from "react-router-dom";
import React, { useState, useEffect } from "react";

import {useDispatch, useSelector} from "react-redux";
import {useAxiosPrivate} from "../hooks/use-axios-private";
import {setUser} from "../redux/userSlice";
import {Loader} from "./loader/Loader";
import {RootState} from "../redux/store/store";

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const axiosPrivate = useAxiosPrivate();
    const persist = useSelector((root:RootState) => root.persist)
    // @ts-ignore
    useEffect(() => {
        let isMounted = true;

        const verifyRefreshToken = async () => {
            try {
                console.log(44)
                const res = await axiosPrivate.patch(`auth/refreshToken`, {
                    headers:{
                        'Headers':`Bearer ${localStorage.getItem('refresh_token')}`
                    }
                });
                console.log(res.data)
                localStorage.setItem('refresh_token', res.data.refreshToken)
                localStorage.setItem('access_token', res.data.accessToken)
                dispatch(setUser({
                    user:res.data.user,
                }));

            }
            catch (err) {
                navigate('/login')
            }
            finally {
                isMounted && setIsLoading(false);
            }
        }
        void verifyRefreshToken()

        return () => isMounted = false;
    }, [])


    return (
        <>
            {!persist ? <Outlet/> :
                isLoading ? <Loader/> : <>
                <Outlet/></>}
        </>
    )
}

export default PersistLogin
