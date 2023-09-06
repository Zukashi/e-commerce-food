import {
    PaymentElement,
    LinkAuthenticationElement,
    AddressElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js";
import './scss/checkout-form.scss'

const fetchCart = async (axios: AxiosInstance): Promise<Product[]> => {
    const res = await axios.get('cart');
    return res.data
}
import React, {MouseEventHandler, useEffect, useState} from "react";
import {useAxiosPrivate} from "../../hooks/use-axios-private";
import {useQuery} from "react-query";
import {AxiosInstance} from "axios";
import {Product} from "../../types/product";
import {Loader} from "../loader/Loader";
import {apiUrl, clientUrl} from "../../config/api";

export const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const axiosPrivate = useAxiosPrivate();
    const {data: products} = useQuery('cart', () => fetchCart(axiosPrivate))
    const [message, setMessage] = useState<null | string>(null);
    const [isLoading, setIsLoading] = useState(false);
    const arrSum = products?.reduce((acc, currentValue) => acc + currentValue.price * currentValue.quantity, 0)
    useEffect(() => {
        if (!stripe) {
            return;
        }

        const clientSecret = new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        );
        console.log(clientSecret)
        if (!clientSecret) {
            return;
        }

        stripe.retrievePaymentIntent(clientSecret).then(({paymentIntent}) => {
            if (!paymentIntent) {
                return null
            }
            console.log(paymentIntent.amount)
            switch (paymentIntent.status) {
                case "succeeded":
                    setMessage("Payment succeeded!");
                    break;
                case "processing":
                    setMessage("Your payment is processing.");
                    break;
                case "requires_payment_method":
                    setMessage("Your payment was not successful, please try again.");
                    break;
                default:
                    setMessage("Something went wrong.");
                    break;
            }
        });
    }, [stripe]);
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }
        setIsLoading(true);

        const response = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${clientUrl}/payment/success`,
            },
        });
        console.log(response)
        setIsLoading(false);
    };
    if (!stripe || !elements) {
        // Stripe.js has not yet loaded.
        // Make sure to disable form submission until Stripe.js has loaded.
        return <Loader/>;
    }

    return (
        <form id="payment-form" className='payment-form-container' onSubmit={handleSubmit}>

            <PaymentElement id="payment-element"/>
            {!isLoading ? <>
                <div className='button-container'>
                    <button disabled={isLoading || !stripe || !elements} id="submit">
        <span id="button-text">
           Pay now
        </span>
                    </button>
                </div>
                {message && <div id="payment-message">{message}</div>}
            </> : <Loader/>}
        </form>
    );
}