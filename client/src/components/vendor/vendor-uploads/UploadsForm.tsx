import React from 'react';
import {FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import '../../login/login.scss'
import {useForm} from "react-hook-form";
import './form.scss'
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {useMutation} from "react-query";
import {createProduct} from "./fetch";
import {useAxiosPrivate} from "../../../hooks/use-axios-private";
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/store/store";
const schema = yup.object().shape({

    productName: yup.string().required('product name is required'),
    price: yup.string().required('price is required'),
    category:yup.string().required('category is required'),
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

export const UploadsForm = () => {
    const {register, formState:{errors}, handleSubmit} = useForm<UploadProductFormValues>({
        resolver:yupResolver(schema)
    });
    const {vendor} = useSelector((root:RootState) => root)
    const axiosPrivate = useAxiosPrivate();
    const createNewProduct  = useMutation({
        mutationFn:createProduct
    })
    type registerType = 'productName' | 'price' | 'quantity'
    const labels = [['Product Name', 'productName'], ['Price (In USD)', 'price'], ['Quantity', 'quantity'] ,['Product Tags', 'tags']]
    const onSubmit = (data:UploadProductFormValues) => {
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
                   >
                       <MenuItem value={'vegetables_&_fruits'}>Vegetables & Fruits</MenuItem>
                       <MenuItem value={'beverages'}>Beverages</MenuItem>
                       <MenuItem value={'meats_&_seafood'}>Meats & Seafood</MenuItem>
                   </Select>

               </FormControl>
               <p className='error-message'>{errors[('category' as registerType)]?.message} </p>
               {labels.map((label,i) => <span className='login-form-item' key={label[1]}><TextField   {...register(label[1] as registerType)} type={i > 0 && i < 3 ? 'number' : 'text'} label={label[0]} variant="outlined"/><p className='error-message'>{errors[(label[1] as registerType)]?.message} </p></span>)}
               <button type={"submit"} className='confirm-send'>SUBMIT</button>
           </form>
       </section></>)
}