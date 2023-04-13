import {Outlet, useNavigate} from "react-router-dom";
import React, { useState, useEffect } from "react";

import {useDispatch} from "react-redux";
import {apiUrl} from "../config/api";
import {useAxiosPrivate} from "../hooks/use-axios-private";
import {setUser} from "../redux/userSlice";

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const axiosPrivate = useAxiosPrivate();
    // @ts-ignore
    useEffect(() => {
        let isMounted = true;

        const verifyRefreshToken = async () => {
            try {
                const res = await axiosPrivate.patch(`auth/refreshToken`);
                if(res.status === 403){
                    navigate('/login')
                }
                dispatch(setUser({
                    user:res.data.user,
                }));
                // navigate('/home')
            }
            catch (err) {
                navigate('/')
            }
            finally {
                isMounted && setIsLoading(false);
            }
        }
        void verifyRefreshToken()

        return () => isMounted = false;
    }, [])

    if(isLoading){
        return <h2>Loading</h2>
    }
    return (
        <>
            {!isLoading && <>
                <Outlet/></>}
        </>
    )
}

export default PersistLogin
