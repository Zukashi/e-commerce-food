import {UploadProductFormValues} from "./UploadsForm";
import {AxiosInstance} from "axios";

export const createProduct = async ({data, axiosPrivate}:{axiosPrivate:AxiosInstance,data:UploadProductFormValues}) => {
    const res = await axiosPrivate.post('vendor/product', data);
    return res.data
}