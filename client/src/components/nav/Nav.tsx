import React, {useState} from 'react';
import './nav.scss'
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import {DrawerComponent} from "./DrawerComponent";
import {useDispatch} from "react-redux";
import {setDrawer} from "../../redux/nav";
export const Nav = () => {
    const dispatch = useDispatch();
    return (
        <nav className='navbar'>
        <div className='container'>
            <MenuIcon className='icon ' onClick={() => dispatch(setDrawer(true))} fontSize={'large'}/>
            <div className='right-side-icons-container'>
                <FavoriteBorderOutlinedIcon fontSize={'large'}/>
                <ShoppingCartOutlinedIcon fontSize={'large'}/>
                <AccountCircleIcon fontSize={'large'}/>
            </div>
        </div>
            <DrawerComponent/>
        </nav>
    )

}