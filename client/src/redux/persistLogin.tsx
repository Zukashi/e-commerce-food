import {createSlice, PayloadAction} from '@reduxjs/toolkit'


const initialState:any = JSON.parse(localStorage.getItem('persist') as any) || false
console.log(initialState)
export const persistSlice = createSlice({
    name: 'persist',
    initialState,
    reducers: {
        setPersist(state, action:PayloadAction<boolean>){
            state = action.payload
        }

    }
})
export const { setPersist } = persistSlice.actions