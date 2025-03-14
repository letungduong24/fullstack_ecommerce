import React, { useEffect } from 'react'
import Hero from '../components/Layout/Hero'
import NewArrival from '../components/Products/NewArrival'
import ProductsDetails from '../components/Products/ProductsDetails'
import { useSelector, useDispatch } from 'react-redux'
import { fetchBestSeller } from '../redux/slices/productsSlice'

const Home = () => {
    const dispatch = useDispatch()
    const {bestSeller} = useSelector((state) => state.product)
    useEffect(() => {
      dispatch(fetchBestSeller())
    }, [dispatch])
  
  return (
    <>
        <Hero />
        <NewArrival />
        <h2 className='text-3xl text-center font-bold mb-4'>Best Seller</h2>
        {bestSeller && <ProductsDetails id={bestSeller._id}  />}
    </>
  )
}

export default Home