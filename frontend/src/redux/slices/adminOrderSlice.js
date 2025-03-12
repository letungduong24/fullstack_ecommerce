import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchAllOrders = createAsyncThunk('adminOrder/fetchAllOrders', async({status, limit}) => {
    const query = new URLSearchParams()
    if(status) query.append('status', status)
    if(limit) query.append('limit', limit)
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/orders?${query.toString()}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`
        }
    })
    return response.data
})

export const updateOrderStatus = createAsyncThunk('adminOrder/updateOrderStatus', async({id, status}, {rejectWithValue}) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`, {status},  {
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



export const deleteOrder = createAsyncThunk('adminOrder/deleteOrder', async(id, {rejectWithValue}) => {
    try {
        const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`,  {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            }
        })
        return response.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

const adminOrderSlice = createSlice({
    name: 'adminOrder',
    initialState: {
        order: [],
        totalOrder: 0,
        totalSales: 0,
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        // fetch all product
        builder
        .addCase(fetchAllOrders.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchAllOrders.fulfilled, (state, action) => {
            state.loading = false;
            state.order = action.payload;
            state.totalOrder = action.payload.length
            state.totalSales = action.payload.reduce((acc, order) => {
                return acc + order.totalPrice
            }, 0)
        })
        .addCase(fetchAllOrders.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        // update user
        builder
        .addCase(updateOrderStatus.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updateOrderStatus.fulfilled, (state, action) => {
            state.loading = false;
            const updatedOrder = action.payload.order
            state.order = state.order.filter((order) => order._id !== updatedOrder._id)
        })
        .addCase(updateOrderStatus.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        // delete user
        builder
        .addCase(deleteOrder.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(deleteOrder.fulfilled, (state, action) => {
            state.loading = false;
            const deletedOrder = action.payload
            state.order = state.order.filter((order) => order._id !== deletedOrder._id)
        })
        .addCase(deleteOrder.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
    }
})

export default adminOrderSlice.reducer