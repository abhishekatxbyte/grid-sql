import { configureStore } from '@reduxjs/toolkit'
import reducer from './slice'
import userslice from './userslice'

export const store = configureStore({
    reducer: {
        data: reducer,
        user: userslice
    },
})