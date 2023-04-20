import React, { useState } from 'react'
import './scss/main.scss'
import {Route, Routes} from "react-router-dom";
import { Home } from './pages/Home';
import {LayoutDefault} from "./layouts/LayoutDefault";
import {Shop} from "./pages/Shop";
import PersistLogin from "./components/PersistLogin";
import {Login} from "./components/login/login";
import {RegisterPage} from "./pages/Register";
import { ToastContainer } from 'react-toastify';
import {VendorDashboard} from "./components/vendor/vendor-dashboard";
import { VendorLayout } from './layouts/VendorLayout';

function App() {


        return (
            <>
                <ToastContainer/>
            <Routes>
                        <Route element={<PersistLogin/>}>
                            <Route element={<LayoutDefault/>}>
                                <Route path={'vendor'} element={<VendorLayout/>} >
                                    <Route path={'dashboard'} element={<VendorDashboard/>} index></Route>
                                    <Route path={'uploads'} ></Route>
                                    <Route path={'settings'}></Route>

                                </Route>
                                <Route path={'shop'} element={<Shop/>}/>
                                <Route index element={<Home/>}/>
                            </Route>
                        </Route>
            <Route element={<LayoutDefault/>}>
                <Route path='/login' element={<Login/>}>

                </Route>
                <Route path={'/register'} element={<RegisterPage/>}></Route>
            </Route>
            </Routes>
                </>
        )
}

export default App
