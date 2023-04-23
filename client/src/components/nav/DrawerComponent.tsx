import React from 'react';
import CloseIcon from "@mui/icons-material/Close";
import {Drawer} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store/store";
import {setDrawer} from "../../redux/nav";
import {NavLink} from "react-router-dom";

export const DrawerComponent =() => {
    const dispatch = useDispatch();
    const arrOfNavLinks = ['/', '/shop', '/vendor'];
    const drawer = useSelector((state:RootState) => state.nav.drawerBoolean)
    return (<>
        <Drawer
            open={drawer}

            onClose={() => dispatch(setDrawer(false))}
        >
            <div className='drawer'>
                <div className='modal-header'>
                    <p>Logo</p><div className='background-for-icon'>
                    <CloseIcon onClick={() => dispatch(setDrawer(false))}/>
                </div>
                </div>
                <form className='form'>
                    <label className='input-drawer-label'>
                        <input className='input-drawer' placeholder='Search for items...'  />
                        <i className='fas fa-search icon'></i>
                    </label>
                </form>
               <div className='links'>
                   {arrOfNavLinks.map((navLink) => <NavLink key={navLink} to={navLink} onClick={() => dispatch(setDrawer(false))}   className={({ isActive }) =>
                        isActive ? "active" : ""
                   }><p>
                       {navLink !== '/' ? navLink.replace('/', '').charAt(0).toUpperCase() + navLink.replace('/', '').slice(1) : 'Home'
                       }
                   </p></NavLink>)}
               </div>
            </div>
        </Drawer></>)
}