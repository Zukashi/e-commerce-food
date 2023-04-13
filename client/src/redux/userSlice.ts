import {createSlice, PayloadAction} from '@reduxjs/toolkit'

export interface User {
    user:any;
}
const initialState:User = {
    user:{}

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