import React from 'react';
import {FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import {useForm} from "react-hook-form";
import './form.scss'
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {useMutation} from "react-query";
import {createProduct} from "./fetch";
import {useAxiosPrivate} from "../../../hooks/use-axios-private";
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/store/store";
import {toast} from "react-toastify";
import {OneFormItem} from "./OneFormItem";
import {toastPosition, toastTheme} from "../../../config/api";
import {Product} from "../../../types/product";
import {AxiosError} from "axios";

const schema = yup.object().shape({

    productName: yup.string().strict().required('product name is required'),
    price: yup.string().required('price is required').strict(),
    category: yup.string().required('category is required'),
    quantity: yup.string().required('quantity is required'),
    tags: yup.string().optional(),

});

export type UploadProductFormValues = {
    productName: string;
    price: string;
    category: string;
    quantity: string;
    tags?: string;
};
export type registerType = 'productName' | 'price' | 'quantity'
const labels = [['Product Name', 'productName'], ['Price (In USD)', 'price'], ['Quantity', 'quantity'], ['Product Tags', 'tags']];
export const UploadsForm = () => {
    const {register, formState: {errors}, handleSubmit} = useForm<UploadProductFormValues>({
        resolver: yupResolver(schema)
    });

    const {vendor} = useSelector((root: RootState) => root)
    const axiosPrivate = useAxiosPrivate();
    const createNewProduct = useMutation(createProduct, {
        onSuccess: (data: Product) => {
            toast.success(`Product ${data.productName} has been added`, {
                position: toastPosition,
                theme: toastTheme
            });
        },
          onError: (error: AxiosError) => {
        if (error.response && error.response.status === 409) {
            toast.error('Resource conflict. Please try again.', {
                position: toastPosition,
                theme: toastTheme
            });
        } else {
            toast.error('An error occurred. Please try again.', {
                position: toastPosition,
                theme: toastTheme
            });
        }
    }

    });


    const onSubmit = (data: UploadProductFormValues) => {
        createNewProduct.mutate({data, axiosPrivate, vendor})
    }
    return (<>
        <section>
            <form className='form' onSubmit={handleSubmit(onSubmit)}>

                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Select Category</InputLabel>
                    <Select
                        labelId="category-label"
                        {...register('category')}
                        label="Select Category"
                        className={'customSelect'}
                        sx={{
                            '& MuiInputBase-root': {
                                padding: '24px'
                            },
                        }}

                    >
                        <MenuItem value={'vegetables & fruits'}>Vegetables & Fruits</MenuItem>
                        <MenuItem value={'milks & dairies'}>Milks & Dairies</MenuItem>

                        <MenuItem value={'beverages'}>Beverages</MenuItem>
                        <MenuItem value={'meats & seafood'}>Meats & Seafood</MenuItem>
                    </Select>

                </FormControl>
                <p className='error-message'>{errors[('category' as registerType)]?.message} </p>
                {labels.map((label, i) => <OneFormItem key={i} label={label} i={i} register={register}
                                                       errors={errors}></OneFormItem>)}

                <button type={"submit"} className='confirm-send'>SUBMIT</button>
            </form>
        </section>
    </>)
}