import React, {useEffect, useState} from 'react';
const stripePromise = loadStripe('pk_test_51NJOH7F6ApijUKU4FS1r5tlrVciPQKKGoKSWdjjshBrzY5RZEFGWmM4fmXGOVlFHeOQCdzbvmbuABZ3wEa02h9wZ00DVvuvc9V');
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import {CheckoutForm} from "../components/cart/CheckoutForm";
import {useAxiosPrivate} from "../hooks/use-axios-private";
import {Loader} from "../components/loader/Loader";
import {useLocation, useSearchParams} from "react-router-dom";
export const PaymentPage = () => {
    const [clientSecret, setClientSecret] = useState("");
    let [searchParams, setSearchParams] = useSearchParams();
    const axiosPrivate = useAxiosPrivate();
    const location = useLocation();
    console.log(location.state)
    const callPayment = async() => {
        const res = await axiosPrivate.post("stripe/create-payment-intent", {arrSum:location.state})
        setClientSecret(res.data)
        setSearchParams({payment_intent_client_secret:res.data})
    }
    useEffect(() => {
        !clientSecret && callPayment()
    }, [])
    console.log(clientSecret)
    const options = {
        clientSecret,
    };
    if(!clientSecret){
        return <Loader/>
    }
    return (<>
        {clientSecret && (
            <Elements options={options} stripe={stripePromise}>
                <CheckoutForm />
            </Elements>
        )}
    </>)
}