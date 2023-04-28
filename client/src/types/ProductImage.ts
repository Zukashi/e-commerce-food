import {Product} from "./product";

export interface ProductImage {
    id:string,
    imageName:string,
    imageUrl?:string,
    product:Product
}