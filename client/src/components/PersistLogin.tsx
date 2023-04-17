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
    const {persist} = useSelector((root:RootState) => root)
    // @ts-ignore
    useEffect(() => {
        let isMounted = true;

        const verifyRefreshToken = async () => {
            try {
                const res = await axiosPrivate.patch(`auth/refreshToken`);
                dispatch(setUser({
                    user:res.data.user,
                }));

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
        console.log(persist,'persist')
    }, [isLoading])
    return (
        <>
            {!persist ? <Outlet/> :
                isLoading ? <Loader/> : <>
                <Outlet/></>}
        </>
    )
}

export default PersistLogin
