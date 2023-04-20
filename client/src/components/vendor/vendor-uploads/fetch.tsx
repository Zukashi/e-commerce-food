import {useAxiosPrivate} from "../../../hooks/use-axios-private";
import {UploadProductFormValues} from "./UploadsForm";

export const createProduct = async (data:UploadProductFormValues) => {
    const axios = useAxiosPrivate()
    const res = await axios.post('product', data);
    return res.data
}