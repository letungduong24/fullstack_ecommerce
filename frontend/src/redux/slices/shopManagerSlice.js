import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'sonner'

export const fetchShopManager = createAsyncThunk('shopManager/fetchShopManager', async() => {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/shop-manager`)
    return response.data
})


export const updateShopManager = createAsyncThunk('shopManager/updateShopManager', async(data, {rejectWithValue}) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/shop-manager`, data,  {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            }
        })
        console.log(response.data)
        return response.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})


const shopManagerSlice = createSlice({
    name: 'shopManager',
    initialState: {
        shopManager: null,
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        // fetch shopmanager
        builder
        .addCase(fetchShopManager.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchShopManager.fulfilled, (state, action) => {
            state.loading = false;
            state.shopManager = action.payload;
        })
        .addCase(fetchShopManager.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        // update user
        builder
        .addCase(updateShopManager.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updateShopManager.fulfilled, (state, action) => {
            state.loading = false;
            state.shopManager = action.payload;
            toast.success('Lưu thành công!')
        })
        .addCase(updateShopManager.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
    }
})

export default shopManagerSlice.reducer