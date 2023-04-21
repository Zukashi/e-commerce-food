import {UploadProductFormValues} from "./UploadsForm";
import axios, {AxiosInstance} from "axios";
import {Images} from "../../../redux/vendor-uploads";

export const createProduct = async ({data, axiosPrivate, vendor}:{axiosPrivate:AxiosInstance,data:UploadProductFormValues, vendor:Images}) => {
    const formData = new FormData();
    /*
        * Add first image Main one
    */
    const resMainImg = await axios.get(vendor.mainImage, {responseType:'blob'});
    const json = JSON.stringify(resMainImg.data);
    const blob = new Blob([json], {
        type: 'application/json'
    });
    await formData.append("image", blob);

    // sub images
    const responses = await Promise.all(vendor.subImages.map(async (imgUrl:string) => {
        return await axios.get(imgUrl, {responseType:'blob'})
    }));
    await responses.forEach(async (r,i) => {
        const json = JSON.stringify(r.data);
        const blob = new Blob([json], {
            type: 'application/json'
        });
        await formData.append(`image`, blob);
    }, Error());

    await formData.append('product', JSON.stringify(data));
    console.log(formData.getAll('image'))
    const res = await axiosPrivate.post('vendor/product', formData, {
        headers:{
            "Content-Type":"multipart/form-data"
        }
        },
    );
    return res.data
}