import React, { useState } from 'react'
import './scss/main.scss'
import {Route, Routes} from "react-router-dom";
import { Home } from './pages/Home';
import {LayoutDefault} from "./layouts/LayoutDefault";
import {Vendors} from "./pages/Vendors";
import {Shop} from "./pages/Shop";
import PersistLogin from "./components/PersistLogin";
import {Login} from "./components/login";


function App() {


        return (
            <>
            <Routes>
                        <Route element={<PersistLogin/>}>
                            <Route element={<LayoutDefault/>}>
                                <Route path={'vendors'} element={<Vendors/>}/>
                                <Route path={'shop'} element={<Shop/>}/>
                                <Route index element={<Home/>}/>
                            </Route>
                        </Route>
            <Route element={<LayoutDefault/>}>
                <Route path='/login' element={<Login/>}>

                </Route>
            </Route>
            </Routes>
                </>
        )
}

export default App
