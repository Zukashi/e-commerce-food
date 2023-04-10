import React from 'react';
import {Nav} from "../components/nav/Nav";
import {Outlet} from "react-router-dom";


export const LayoutDefault = () => {
    return (<>
    <Nav></Nav>
        <Outlet/>
    </>)
}