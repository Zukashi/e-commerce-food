import React, {useState} from 'react';
import './nav.scss'
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import {Button, Drawer} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
export const Nav = () => {
    const [drawer, setDrawer] = useState(false)
    return (
        <nav className='navbar'>
        <div className='container'>
            <MenuIcon className='icon ' onClick={() => setDrawer(true)} fontSize={'large'}/>
            <div className='right-side-icons-container'>
                <FavoriteBorderOutlinedIcon fontSize={'large'}/>
                <ShoppingCartOutlinedIcon fontSize={'large'}/>
                <AccountCircleIcon fontSize={'large'}/>
            </div>
        </div>
            <Drawer className='drawer'
                anchor={'left'}
                open={drawer} classes={{
            modal:'width:200px'
            }
            }
                onClose={() => setDrawer(false)}
            >
                <div>
                    <div className='modal-header'>
                        <p>Logo</p><div className='background-for-icon'>
                        <CloseIcon onClick={() => setDrawer(false)}/>
                    </div>
                    </div>
                    <input type="text" placeholder={'search for items'}/>
                </div>
            </Drawer>
        </nav>
    )

}