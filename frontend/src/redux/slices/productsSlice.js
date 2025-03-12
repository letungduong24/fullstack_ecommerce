import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchProductsByFilter = createAsyncThunk(
    'products/fetchByFilters', 
    async ({
        size,
        sortBy,
        search,
        limit,
        category
    }) => {
    const query = new URLSearchParams();
    if(size) query.append('size', size)
    if(sortBy) query.append('sortBy', sortBy)
    if(search) query.append('search', search)
    if(limit) query.append('limit', limit)
    if(category) query.append('category', category)
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products?${query.toString()}`)
    return response.data
})


export const fetchProductDetails = createAsyncThunk('products/fetchProductDetails', async(id) => {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`)
    console.log(response.data)
    return response.data
})

export const updateProduct = createAsyncThunk('products/updateProduct', async({id, productData}) => {
    const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`, productData, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`
        }
    })
    return response.data
})

export const fetchSimilarProducts = createAsyncThunk('products/fetchSimilarProducts', async(id) => {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/similar/${id}`)
    return response.data
})

export const fetchNewArrival = createAsyncThunk('products/fetchNewArrival', async() => {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrival`)
    return response.data
})

export const fetchBestSeller = createAsyncThunk('products/fetchBestSeller', async() => {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`)
    return response.data
})

const productsSlice = createSlice({
    name: 'products',
    initialState: {
        products: [],
        selectedProduct: null,
        similarProducts: [],
        bestSeller: null,
        newArrivalProducts: [],
        loading: false,
        error: null,
        filters: {
            category: '',
            size: '',
            color: '',
            gender: '',
            sortBy: '',
            search: '',
        }
    },
    reducers: {
        setFilters: (state, action) => {
            state.filters = {...state.filters, ...action.payload}
        },
        clearFilters: (state) => {
            state.filters = {
                category: '',
                size: '',
                color: '',
                gender: '',
                brand: '',
                sortBy: '',
                search: '',
                material: '',
            }
        }
    },
    extraReducers: (builder) => {
        builder
        // fetchProductByFIlter
        .addCase(fetchProductsByFilter.pending, (state) => {
            state.loading = true;
            state.error = null
        })
        .addCase(fetchProductsByFilter.fulfilled, (state, action) => {
            state.loading = false;
            state.products = Array.isArray(action.payload) ? action.payload : []
        })
        .addCase(fetchProductsByFilter.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message
        })
        // fetchProductDetail
        .addCase(fetchProductDetails.pending, (state) => {
            state.loading = true;
            state.error = null
        })
        .addCase(fetchProductDetails.fulfilled, (state, action) => {
            state.loading = false;
            state.selectedProduct = action.payload
        })
        .addCase(fetchProductDetails.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message
        })
        // updateProduct
        .addCase(updateProduct.pending, (state) => {
            state.loading = true;
            state.error = null
        })
        .addCase(updateProduct.fulfilled, (state, action) => {
            state.loading = false;
            const updatedProduct = action.payload
            const index = state.products.findIndex(
                (product) => product._id === updatedProduct._id
            )
            if (index !== -1){
                state.products[index] = updatedProduct;
            }
        })
        .addCase(updateProduct.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message
        })
        // fetchSimilarProduct
        .addCase(fetchSimilarProducts.pending, (state) => {
            state.loading = true;
            state.error = null
        })
        .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
            state.loading = false;
            state.similarProducts = Array.isArray(action.payload) ? action.payload : []
        })
        .addCase(fetchSimilarProducts.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message
        })
        // fetchNewArrival
        .addCase(fetchNewArrival.pending, (state) => {
            state.loading = true;
            state.error = null
        })
        .addCase(fetchNewArrival.fulfilled, (state, action) => {
            state.loading = false;
            state.newArrivalProducts = Array.isArray(action.payload) ? action.payload : []
        })
        .addCase(fetchNewArrival.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message
        })
        // fetch best seller
        .addCase(fetchBestSeller.pending, (state) => {
            state.loading = true;
            state.error = null
        })
        .addCase(fetchBestSeller.fulfilled, (state, action) => {
            state.loading = false;
            state.bestSeller = action.payload
        })
        .addCase(fetchBestSeller.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message
        })
        
    }
})

export const {setFilters, clearFilters} = productsSlice.actions;
export default productsSlice.reducer