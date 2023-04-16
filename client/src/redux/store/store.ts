import {configureStore} from "@reduxjs/toolkit";
import {navSlice} from "../nav";
import {userSlice} from "../userSlice";
import {persistSlice} from "../persistLogin";

export const store = configureStore({
    reducer: {
        nav:navSlice.reducer,
        user:userSlice.reducer,
        persist:persistSlice.reducer
    }
})
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch