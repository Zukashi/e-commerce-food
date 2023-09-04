import React, {useState} from 'react';
import './nav.scss'
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import CompareArrowsOutlinedIcon from '@mui/icons-material/CompareArrowsOutlined';
import ClearIcon from '@mui/icons-material/Clear';
import {DrawerComponent} from "./DrawerComponent";
import {useDispatch, useSelector} from "react-redux";
import {setDrawer} from "../../redux/nav";
import {useQuery} from "react-query";
import {useAxiosPrivate} from "../../hooks/use-axios-private";
import {AxiosInstance} from "axios";
import { Cart } from './cart/Cart';
import {RootState} from "../../redux/store/store";
import {Loader} from "../loader/Loader";

const fetchCart = async (axios:AxiosInstance) => {
    const res = await axios.get('cart');

      console.log(res.data)
      return res.data
}

export const Nav = () => {
    const user = useSelector((root:RootState) => root.user)
    console.log(user.user)
    const dispatch = useDispatch();
    const axiosPrivate = useAxiosPrivate();
    const {data, isLoading, isFetching} = useQuery({queryKey:['cart'], queryFn: () => fetchCart(axiosPrivate)});
    if(isLoading){
        return <Loader/>
    }
    return (
        <nav className='navbar'>
        <div className='container'>
            <MenuIcon className='icon' onClick={() => dispatch(setDrawer(true))} fontSize={'large'}/>
            <div className="input-container"></div>
            <div className='right-side-icons-container'>
                <div className='fade-container'>
                    <CompareArrowsOutlinedIcon fontSize={'large'}/>
                    <p className='nav-item-text'>Compare</p>
                </div>
                   <div className='fade-container'>
                       <FavoriteBorderOutlinedIcon fontSize={'large'}/>
                       <p className='nav-item-text'>Wishlist</p>
                   </div>
               <Cart data={data}></Cart>
                <div className='fade-container'>
                    <div className='account-dropdown dropdown-animate'>
                        <ul className='account-list'>
                            <li className='list-item'>My Account</li>
                            <li className='list-item'>Order Tracking</li>
                            <li className='list-item'>My Voucher</li>
                            <li className='list-item'>My Wishlist</li>
                            <li className='list-item'>Setting</li>
                            <li className='list-item'>Sign out</li>
                        </ul>
                    </div>
                    <AccountCircleIcon fontSize={'large'} className={'trigger-fade'} />
                    <p className='nav-item-text'>{user.user.username ? user.user.username : 'Account'}</p>
                </div>
            </div>
        </div>
            <DrawerComponent/>
        </nav>
    )

}