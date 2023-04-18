import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import {
    BrowserRouter
} from "react-router-dom";
import { Provider } from 'react-redux'
import {store} from "./redux/store/store";
import {QueryClient, QueryClientProvider} from "react-query";

// create a query client for react query
const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(

    <Provider store={store}>
        <BrowserRouter>
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>
        </BrowserRouter>
    </Provider>

)
