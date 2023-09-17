import {UploadProductFormValues} from "./UploadsForm";
import axios, {AxiosInstance} from "axios";
import {Images} from "../../../redux/vendor-uploads";
import {toast} from "react-toastify";
import {toastTheme} from "../../../config/api";

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
            theme:toastTheme
        })
    }
    const imageFile = new File([resMainImg?.data], 'image.jpg', { type: 'image/jpeg' });
    formData.append("image", imageFile);

    // sub images
    const responses = await Promise.all(vendor.subImages.map(async (imgUrl:string) => {
        return await axios.get(imgUrl,  {
            responseType:"blob"
        })
    }));

    responses.forEach(async (r, i) => {
        const imageFile = new File([r.data], `image${i + 2}.jpg`, {type: 'image/jpeg'});
        formData.append(`image`, imageFile);
    }, Error());
    formData.append('product', JSON.stringify(data));

        const res = await axiosPrivate.post('vendor/product', formData, {
        headers:{
            "Content-Type":"multipart/form-data"
        }
        },
    );
    return res.data

}