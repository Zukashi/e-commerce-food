import {UploadProductFormValues} from "./UploadsForm";
import axios, {AxiosInstance} from "axios";
import {Images} from "../../../redux/vendor-uploads";
import {toast} from "react-toastify";

export const createProduct = async ({data, axiosPrivate, vendor}:{axiosPrivate:AxiosInstance,data:UploadProductFormValues, vendor:Images}) => {
    const formData = new FormData();
    /*
        * Add first image Main one
    */
    let resMainImg
    try{
        resMainImg = await axios.get(vendor.mainImage, {
            responseType:"blob"
        });
    }catch(e){
        toast.error("Main image for product is required to proceed", {
            theme:"dark"
        })
    }
    const imageFile = new File([resMainImg?.data], 'image.jpg', { type: 'image/jpeg' });
    await formData.append("image", imageFile);

    // sub images
    const responses = await Promise.all(vendor.subImages.map(async (imgUrl:string) => {
        return await axios.get(imgUrl,  {
            responseType:"blob"
        })
    }));
    console.log(vendor.subImages)
    await responses.forEach(async (r,i) => {
        const imageFile = new File([r.data], `image${i+2}.jpg`, { type: 'image/jpeg' });
        await formData.append(`image`, imageFile);
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