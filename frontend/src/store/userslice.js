
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

// const apiKey = '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';

// Define the async thunk
export const signUp = createAsyncThunk(
    'data/signUp',
    async (newUser) => {
        try {
            const response = await axios.post('http://localhost:3000/api/users/signup', newUser);

            if (response.status === 200) {
                // User added successfully
                toast.success('User added successfully', {
                    position: 'top-right',
                    autoClose: 3000,
                });

                return response.data; // You can return data received from the server if needed
            } else {
                // Handle error responses
                toast.error('Failed to create a new user', {
                    position: 'top-right',
                    autoClose: 3000,
                });
                throw new Error('Failed to create a new user');
            }
        } catch (error) {
            // Handle network or other errors
            toast.error('User email or phone number already exists', {
                position: 'top-right',
                autoClose: 3000,
            });
            throw error;
        }
    }
);

export const signIn = createAsyncThunk(
    'auth/signIn',
    async (userData) => {
        try {
            const response = await axios.post('http://localhost:3000/api/users/login', userData);

            if (response.status === 200) {
                // User signed in successfully
                toast.success('Sign-in successful', {
                    position: 'top-right',
                    autoClose: 3000,
                });

                return response.data; // You can return user data received from the server if needed
            } else {
                // Handle error responses
                toast.error('Failed to sign in', {
                    position: 'top-right',
                    autoClose: 3000,
                });
                throw new Error('Failed to sign in');
            }
        } catch (error) {
            // Handle network or other errors
            toast.error('Sign-in failed: ' + error.message, {
                position: 'top-right',
                autoClose: 3000,
            });
            throw error;
        }
    }
);
const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: {},
    },

    extraReducers: (builder) => {
        builder.addCase(signUp.pending, (state) => {
            state.loading = true;
            state.error = null;

        }).addCase(signUp.fulfilled, (state, action) => {
            const data = action.payload
            state.loading = false;
            state.currentUser = data;
        }).addCase(signUp.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message; // You can handle the error message here

        });
    },
});


// export const { ADD_DATA, ENABLE_AI, REMOVE_DATA, ADD_FILE, SET_LOADING, ENABLE_CUSTOM, SET_CUSTOM_SCHEMA, ADD_MULTIPLE_DATA } = extractionSlice.actions

// export const inputFile = state => state.extraction.pdfFile

export default userSlice.reducer;






