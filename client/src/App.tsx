import React, { useState } from 'react'
import './scss/main.scss'
import {Route, Routes} from "react-router-dom";
import { Home } from './pages/Home';
import {LayoutDefault} from "./layouts/LayoutDefault";
import {Vendor} from "./pages/Vendor";
import {Shop} from "./pages/Shop";
import PersistLogin from "./components/PersistLogin";
import {Login} from "./components/login/login";
import {RegisterPage} from "./pages/Register";
import { ToastContainer } from 'react-toastify';

function App() {


        return (
            <>
                <ToastContainer/>
            <Routes>
                        <Route element={<PersistLogin/>}>
                            <Route element={<LayoutDefault/>}>
                                <Route path={'vendor'} element={<Vendor/>}/>
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
