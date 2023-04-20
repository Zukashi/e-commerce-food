import React from 'react';
import {FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import '../../login/login.scss'
import {useForm} from "react-hook-form";
import './form.scss'
export const UploadsForm = () => {
    const {register, formState:{errors}, handleSubmit} = useForm();
    type registerType = 'productName' | 'price' | 'quantity'
    const labels = [['Product Name', 'productName'], ['Price (In USD)', 'price'], ['Quantity', 'quantity'] ,['Product Tags', 'tags']]
    return (<>
       <section>
           <form className='form'>

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
               {labels.map((label,i) => <span className='login-form-item' key={label[1]}><TextField   {...register(label[1] as registerType)} type={i > 0 && i < 3 ? 'number' : 'text'} label={label[0]} variant="outlined"/><p className='error-message'>{errors[(label[1] as registerType)]?.message} </p></span>)}
           </form>
       </section></>)
}