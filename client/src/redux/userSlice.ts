import {createSlice, PayloadAction} from '@reduxjs/toolkit'
export interface User {
    user:any;
    refresh_token:boolean | string | null,
    access_token:boolean | string,
    isAuthenticated:boolean,
    loading:boolean,
}
const initialState:User = {
    user:{},
    refresh_token:localStorage.getItem('refresh_token') || false,
    access_token:localStorage.getItem('access_token') || false,
    isAuthenticated:false,
    loading:false,

}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action:PayloadAction<{user:User, isAuthenticated:boolean}>){
            state.user = action.payload.user;
            state.isAuthenticated = action.payload.isAuthenticated
        },
        setLoading(state, action:PayloadAction<boolean>){
            state.loading = action.payload
        }

    }
})
export const { setUser, setLoading } = userSlice.actions