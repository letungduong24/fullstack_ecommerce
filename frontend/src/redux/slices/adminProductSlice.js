import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'sonner'

export const fetchProduct = createAsyncThunk('adminProduct/fetchProduct', async() => {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`
        }
    })
    return response.data
})

export const createProduct = createAsyncThunk('adminProduct/createProduct', async(productData, {rejectWithValue}) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/products`, productData,  {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            }
        })
        return response.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})


export const updateProduct = createAsyncThunk('adminProduct/updateProduct', async({id, productData}, {rejectWithValue}) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`, productData,  {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            }
        })
        return response.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

export const deleteProduct = createAsyncThunk('adminProduct/deleteProduct', async(id, {rejectWithValue}) => {
    try {
        const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`,  {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            }
        })
        return response.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

export const productDetails = createAsyncThunk('adminProduct/productDetails', async({id}) => {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`)
    return response.data
})

const adminProductSlice = createSlice({
    name: 'adminProduct',
    initialState: {
        product: [],
        loading: false,
        error: null,
        selectedProduct: null
    },
    reducers: {},
    extraReducers: (builder) => {
        // fetch all product
        builder
        .addCase(fetchProduct.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchProduct.fulfilled, (state, action) => {
            state.loading = false;
            state.product = action.payload;
        })
        .addCase(fetchProduct.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        // fetch  product details
        builder
        .addCase(productDetails.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(productDetails.fulfilled, (state, action) => {
            state.loading = false;
            state.selectedProduct = action.payload;
        })
        .addCase(productDetails.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        // update user
        builder
        .addCase(updateProduct.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updateProduct.fulfilled, (state, action) => {
            state.loading = false;
            const updatedProduct = action.payload
            const productIndex = state.product.findIndex((product) => product._id === updatedProduct._id)
            if(productIndex !== -1){
                state.product[productIndex] = updatedProduct
            }
            toast.success('Cập nhật sản phẩm thành công')

        })
        .addCase(updateProduct.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.errors
            console.log(state.error)
            state.error.forEach((error) => {
                toast.error(error)
            })

        })
        // delete product
        builder
        .addCase(deleteProduct.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(deleteProduct.fulfilled, (state, action) => {
            state.loading = false;
            const deletedProduct = action.payload
            state.product = state.product.filter((product) => product._id !== deletedProduct._id)
        })
        .addCase(deleteProduct.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        // add user
        builder
        .addCase(createProduct.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(createProduct.fulfilled, (state, action) => {
            state.loading = false;
            const addedProduct = action.payload
            state.product.push(addedProduct)
            toast.success('Thêm sản phẩm thành công')
        })
        .addCase(createProduct.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.errors;
            console.log(state.error)
            state.error.forEach((error) => {
                toast.error(error)
            })
        })
    }
})

export default adminProductSlice.reducer