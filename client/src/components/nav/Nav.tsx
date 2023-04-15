import React, {useState} from 'react';
import './nav.scss'
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import CompareArrowsOutlinedIcon from '@mui/icons-material/CompareArrowsOutlined';
import {DrawerComponent} from "./DrawerComponent";
import {useDispatch} from "react-redux";
import {setDrawer} from "../../redux/nav";
export const Nav = () => {
    const dispatch = useDispatch();
    const [accountHover, setAccountHover] = useState(false)
    return (
        <nav className='navbar'>
        <div className='container'>
            <MenuIcon className='icon ' onClick={() => dispatch(setDrawer(true))} fontSize={'large'}/>
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
               <div className='fade-container '>
                   <div className='account-dropdown dropdown-animate cart'>
                       <ul className='account-list cart-list'>
                           <div className='one-product-in-cart'>
                               <img src="" alt="test"/>
                               <div>
                                   <p>Peanut Butter</p>
                                   <p>1x $25.64</p>
                               </div>
                           </div>

                       </ul>
                       <div className='total-cart'>
                           <p>Total:</p>
                           <p>$price</p>
                       </div>
                       <div className='cart-buttons'>
                           <button className='inversed-primary-button'>View Cart</button>
                           <button className='primary-button' >Checkout</button>
                       </div>
                   </div>
                   <ShoppingCartOutlinedIcon className={'trigger-fade'} fontSize={'large'}/>
                   <p className="nav-item-text">Cart</p>
               </div>
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
                    <p className='nav-item-text'>Account</p>
                </div>
            </div>
        </div>
            <DrawerComponent/>
        </nav>
    )

}