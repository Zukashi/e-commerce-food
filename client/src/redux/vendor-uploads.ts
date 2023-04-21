import {createSlice, PayloadAction} from '@reduxjs/toolkit'

export interface Images {
    mainImage:string;
    subImages:string[]
}
const initialState:Images = {
    mainImage:'',
    subImages:[]

}

export const imageUploadsFormSlice = createSlice({
    name: 'vendor-form',
    initialState,
    reducers: {
        setMainImageReducer(state, action:PayloadAction<string>){
             state.mainImage = action.payload
        },
        setSubImageReducer(state, action:PayloadAction<string>){
             state.subImages.push(action.payload)
        }

    }
})
export const { setMainImageReducer, setSubImageReducer } = imageUploadsFormSlice.actions