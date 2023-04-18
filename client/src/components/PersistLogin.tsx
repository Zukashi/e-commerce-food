import {Outlet, useLocation, useNavigate} from "react-router-dom";
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
    const location = useLocation()
    const axiosPrivate = useAxiosPrivate();
    // @ts-ignore
    useEffect(() => {
        let isMounted = true;

        const verifyRefreshToken = async () => {
            try {
                const res = await axiosPrivate.patch(`auth/refreshToken`);
                dispatch(setUser({
                    user:res.data.user,
                }));
                console.log(res.data)
            }
            catch(e){
                navigate('/login', {
                    state:location.pathname
                })
            }
            finally {
                isMounted && setIsLoading(false);
            }
        }
        void verifyRefreshToken()

        return () => isMounted = false;
    }, [])

    useEffect(() => {
        console.log(`isLoading: ${isLoading}`)

    }, [isLoading])
    return (
        <>

            { isLoading ? <Loader/> : <>
                <Outlet/></>}
        </>
    )
}

export default PersistLogin
