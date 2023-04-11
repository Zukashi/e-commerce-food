import React from 'react';
import {useSelector} from "react-redux";
import {RootState} from "../redux/store/store";

export const  Shop = () => {
    const {amount} = useSelector((root:RootState) => root)
    return(<>

        <p>We found {amount} items for you</p>

    </>)
}