import {configureStore} from "@reduxjs/toolkit";
import {navSlice} from "../nav";

export const store = configureStore({
    reducer: navSlice.reducer
})
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch