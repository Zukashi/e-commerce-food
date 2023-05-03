import React, {useState} from 'react';
import './nav.scss'
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import CompareArrowsOutlinedIcon from '@mui/icons-material/CompareArrowsOutlined';
import ClearIcon from '@mui/icons-material/Clear';
import {DrawerComponent} from "./DrawerComponent";
import {useDispatch} from "react-redux";
import {setDrawer} from "../../redux/nav";
import {useQuery} from "react-query";
import {useAxiosPrivate} from "../../hooks/use-axios-private";
import {AxiosInstance} from "axios";

const fetchCart = async (axios:AxiosInstance) => {
      const res = await axios.get('cart');
      console.log(res.data)
      return res.data
}

export const Nav = () => {
    const dispatch = useDispatch();
    const [accountHover, setAccountHover] = useState(false);
    const axiosPrivate = useAxiosPrivate();
    const {data} = useQuery({queryKey:['cart'], queryFn: () => fetchCart(axiosPrivate)});
    console.log(data)
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
                               <img src="" width={'60px'} height={'60px'} alt="test"/>
                               <div className='product-info-container'>
                                   <div className='product-title-container'><p className='title'>Peanut Butter </p><ClearIcon fontSize={'small'}/></div>
                                   <div className='product-amount-price-container'><p>1×</p> <p className='price'>$price</p></div>
                               </div>
                           </div>

                       </ul>
                       <div className='total-cart'>
                           <p className='total'>Total</p>
                           <p className='price'>$price</p>
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