import {Vendor} from "./Vendor";
import {ProductImage} from "./ProductImage";

export interface Product {
    id:string,
    productName:string,
    price:number,
    category:string,
    quantity:number,
    productImages?:ProductImage[],
    vendor:Vendor
}