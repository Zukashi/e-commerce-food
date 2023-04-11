import {createSlice, configureStore, PayloadAction} from '@reduxjs/toolkit'

export interface Drawer {
    items: string[];
}
const initialState:Drawer = {
    items: []

}

export const drawerSlice = createSlice({
    name: 'drawer',
    initialState,
    reducers: {
        setDrawer(state, action:PayloadAction<any[]>){
            state.items = action.payload
        }

    }
})
export const { setDrawer } = drawerSlice.actions