import React from 'react';
import CloseIcon from "@mui/icons-material/Close";
import {Drawer} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store/store";
import {setDrawer} from "../../redux/nav";
import {NavLink} from "react-router-dom";
import {AnimatePresence, motion} from 'framer-motion';

export const DrawerComponent =() => {
    const dispatch = useDispatch();
    const arrOfNavLinks = ['/', '/shop', '/vendor'];
    const drawer = useSelector((state:RootState) => state.nav.drawerBoolean)
    return (<>
        <Drawer
            open={drawer}

            onClose={() => dispatch(setDrawer(false))}
        ><AnimatePresence>
            <div className='drawer'>
                <div className='modal-header'>
                    <p>Logo</p><div className='background-for-icon'>

                    <motion.div className='container'
                                initial={{opacity:0, rotate:-512}}
                                animate={{opacity:1, rotate:0}}
                                transition={{ duration: 0.5 }}
                                whileTap={{ rotate:256 }}
                                onClick={() => dispatch(setDrawer(false))}
                    >
                        <CloseIcon />
                    </motion.div>
                </div>
                </div>
                <form className='form'>
                    <label className='input-drawer-label'>
                        <input className='input-drawer' placeholder='Search for items...'  />
                        <i className='fas fa-search icon'></i>
                    </label>
                </form>
               <ul className='links'>
                   {arrOfNavLinks.map((navLink,i) => <motion.li
                       key={navLink}
                     initial={{ opacity: 0, x: -300 }}
                     animate={{ opacity: 1, x:0 }}
                     exit={{ opacity: 0, x: -300 }}
                     transition={{ duration: 0.5, delay:i * 0.1 }}><NavLink key={navLink} to={navLink} onClick={() => dispatch(setDrawer(false))}   className={({ isActive }) =>
                       isActive ? "active" : ""
                   }><p>
                       {navLink !== '/' ? navLink.replace('/', '').charAt(0).toUpperCase() + navLink.replace('/', '').slice(1) : 'Home'
                       }
                   </p></NavLink></motion.li>)}
               </ul>
            </div></AnimatePresence>
        </Drawer></>)
}