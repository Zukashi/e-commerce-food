import {createSlice, PayloadAction} from '@reduxjs/toolkit'

export interface User {
    user:any;
    refresh_token:boolean | string | null,
    access_token:boolean | string,
}
const initialState:User = {
    user:{},
    refresh_token:localStorage.getItem('refresh_token') || false,
    access_token:localStorage.getItem('access_token') || false

}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action:PayloadAction<any>){
            state.user = action.payload
        }

    }
})
export const { setUser } = userSlice.actions