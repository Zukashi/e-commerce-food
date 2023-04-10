import React, { useState } from 'react'
import './main.css'
import {Route, Routes} from "react-router-dom";
import { Home } from './pages/Home';
import {LayoutDefault} from "./layouts/LayoutDefault";


function App() {


        return (
            <>
            <Routes>
                        <Route element={<LayoutDefault/>}>
                            <Route index element={<Home/>}></Route>
                        </Route>

            </Routes>
                </>
        )
}

export default App
