import React from 'react';
import CloseIcon from "@mui/icons-material/Close";
import {Drawer} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store/store";
import {setDrawer} from "../../redux/nav";

export const DrawerComponent =() => {
    const dispatch = useDispatch();
    const drawer = useSelector((state:RootState) => state.drawerBoolean)
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
            </div>
        </Drawer></>)
}