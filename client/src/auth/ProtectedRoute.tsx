import React, {ReactNode} from "react";
import {Navigate, Outlet, Route, useLocation} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../redux/store/store";

export function ProtectedRoute({  requiredPermission }: { requiredPermission:string}) {
    const location = useLocation();
    const {user} = useSelector((root:RootState) => root.user);
    console.log(user.role)
    return (user && user.role === requiredPermission ? (<Outlet/>) : (<Navigate to={"/login"} state={{from:location}}   />)



    );
}