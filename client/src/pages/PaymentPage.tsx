import React, {useEffect, useState} from 'react';

const stripePromise = loadStripe('pk_test_51NJOH7F6ApijUKU4FS1r5tlrVciPQKKGoKSWdjjshBrzY5RZEFGWmM4fmXGOVlFHeOQCdzbvmbuABZ3wEa02h9wZ00DVvuvc9V');
import {loadStripe} from "@stripe/stripe-js";
import {Elements} from "@stripe/react-stripe-js";
import {CheckoutForm} from "../components/cart/CheckoutForm";
import {useAxiosPrivate} from "../hooks/use-axios-private";
import {Loader} from "../components/loader/Loader";
import {useLocation, useSearchParams} from "react-router-dom";
import {AxiosInstance} from "axios/index";
import {Product} from "../types/product";
import {useQuery} from "react-query";

const fetchCart = async (axios: AxiosInstance): Promise<Product[]> => {
    const res = await axios.get('cart');
    return res.data
}

export const PaymentPage = () => {
    const [clientSecret, setClientSecret] = useState("");
    let [searchParams, setSearchParams] = useSearchParams();
    const axiosPrivate = useAxiosPrivate();
    const location = useLocation();
    const {data: products, isLoading, isFetching} = useQuery('cart', () => fetchCart(axiosPrivate))


    const callPayment = async () => {
        try {
            const res = await axiosPrivate.post("stripe/create-payment-intent", {arrSum: location.state});
            if (res.data) {
                const createOrder = async () => {
                    try {
                        console.log(products);
                        const res = await axiosPrivate.post("order", {products});
                        console.log("Order created", res.data);
                    } catch (error) {
                        console.error("Error creating order:", error);
                    }
                };
                await createOrder();
            }
            setClientSecret(res.data);
            setSearchParams({payment_intent_client_secret: res.data});
        } catch (error) {
            console.error("Error in payment intent:", error);
        }
    };
    useEffect(() => {
        !clientSecret && callPayment();

    }, [])
    const options = {
        clientSecret,
    };
    if (!clientSecret || !products) {
        return <Loader/>
    }
    return (<>
        {clientSecret && (
            <Elements options={options} stripe={stripePromise}>
                <CheckoutForm/>
            </Elements>
        )}
    </>)
}