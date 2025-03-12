import React, { useEffect, useRef, useState } from 'react'
import { FaFilter } from 'react-icons/fa'
import FilterSidebar from '../components/Products/FilterSidebar'
import ProductGrid from '../components/Products/ProductGrid'
import { useDispatch, useSelector } from 'react-redux'
import Loading from '../components/Common/Loading'
import { fetchProductsByFilter } from '../redux/slices/productsSlice'
import { useParams, useSearchParams } from 'react-router-dom'

const CollectionsPage = () => {
  const [searchParams] = useSearchParams()
  const dispatch = useDispatch()
  const {products, loading, error} = useSelector((state) => state.product)
  const queryParams = Object.fromEntries([...searchParams])
  const sidebarRef = useRef(null)

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleClickOutside = (e) => {
    if(sidebarRef.current && !sidebarRef.current.contains(e.target)){
      setIsSidebarOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  })

  useEffect(() => {
    console.log("queryParams before dispatch:", queryParams);
    
    dispatch(fetchProductsByFilter(queryParams));

  }, [dispatch, searchParams])

  if(loading){
    return <Loading />
  }
  return (
    <div className='flex flex-col lg:flex-row px-8'>
        <button onClick={toggleSidebar} className="cursor-pointer lg:hidden border p-2 flex justify-center items-center rounded-lg my-4">
            <FaFilter className='mr-2 text-gray-700' />
        </button>
        <div ref={sidebarRef} className={`${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} fixed z-50 bottom-0 top-0 right-0 w-2/3 bg-white transition-all duration-300 overflow-y-auto lg:w-1/4 lg:static h-full lg:translate-x-0`}>
          <FilterSidebar />
        </div>
        <div className="w-full lg:w-3/4 flex-col lg:p-4">
          <div className="flex justify-between">
            <h2 className='text-2xl font-semibold'>Tất cả sản phẩm</h2>  
          </div>     
          {products &&  <ProductGrid products={products} loading={loading}/>} 
        </div>
    </div>
  )
}

export default CollectionsPage