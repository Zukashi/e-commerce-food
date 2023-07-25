import React, { useState } from 'react'
import './scss/main.scss'
import {Route, Routes} from "react-router-dom";
import { Home } from './pages/Home';
import {LayoutDefault} from "./layouts/LayoutDefault";
import {Shop} from "./pages/Shop";
import {Login} from "./components/login/login";
import {RegisterPage} from "./pages/Register";
import { ToastContainer } from 'react-toastify';
import {VendorDashboard} from "./components/vendor/vendor-dashboard";
import { VendorLayout } from './layouts/VendorLayout';
import {VendorUploads} from "./components/vendor/vendor-uploads/vendor-uploads";
import {ProtectedRoute} from "./auth/ProtectedRoute";
import {RefreshUserDataOnEveryRequest} from "./components/PersistLogin";
import {ShopCart} from "./components/cart/ShopCart";

function App() {


        return (
            <>
                <ToastContainer/>
            <Routes>
                        <Route element={<RefreshUserDataOnEveryRequest/>}>
                            <Route element={<LayoutDefault/>}>
                                <Route  element={<ProtectedRoute requiredPermission={'vendor'}/>} >
                                    <Route element={<VendorLayout/>} path={'vendor'}>
                                        <Route path={'dashboard'} element={<VendorDashboard/>} index></Route>
                                        <Route path={'uploads'} element={<VendorUploads/>}></Route>
                                        <Route path={'settings'}></Route>
                                    </Route>
                                </Route>
                                <Route path={'shop'} element={<Shop/>}/>
                                <Route index element={<Home/>}/>
                                <Route path={'cart'} element={<ShopCart/>}></Route>
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
