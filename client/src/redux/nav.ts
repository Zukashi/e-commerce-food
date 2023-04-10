import {createSlice, configureStore, PayloadAction} from '@reduxjs/toolkit'

export interface Nav {
    drawerBoolean:boolean,
}
const initialState:Nav = {
    drawerBoolean: false

}

export const navSlice = createSlice({
    name: 'nav',
    initialState,
    reducers: {
            setDrawer(state, action:PayloadAction<boolean>){
                state.drawerBoolean = action.payload
            }

    }
})
export const { setDrawer } = navSlice.actions