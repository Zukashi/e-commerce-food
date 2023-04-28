import {Product} from "./product";

export interface Vendor {
    id:string,
    username:string,
    email:string,
    password:string,
    refresh_token?:string,
    products?:Product[]
}