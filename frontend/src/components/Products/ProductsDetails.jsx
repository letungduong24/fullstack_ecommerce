import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useSelector, useDispatch } from 'react-redux'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import ProductGrid from './ProductGrid'
import { fetchProductDetails, fetchSimilarProducts } from '../../redux/slices/productsSlice'
import { useParams } from 'react-router-dom'
import { addToCart } from '../../redux/slices/cartSlice'

const ProductsDetails = ({ id }) => {
  const dispatch = useDispatch()
  const { similarProducts, selectedProduct, loading, error } = useSelector((state) => state.product)
  const { user, guestId } = useSelector((state) => state.auth)
  const { id: paramId } = useParams()
  const productId = id || paramId

  useEffect(() => {
    if (productId) {
      dispatch(fetchSimilarProducts(productId))
      dispatch(fetchProductDetails(productId))
    }
  }, [dispatch, productId])

  const [mainImage, setMainImage] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedQuantity, setSelectedQuantity] = useState(1)
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)

  useEffect(() => {
    if (selectedProduct?.images?.length > 0) {
      setMainImage(selectedProduct.images[0].url)
    }
  }, [selectedProduct])

  const handleQuantityChange = (action) => {
    if (action === 'plus') setSelectedQuantity((prev) => prev + 1)
    if (action === 'minus' && selectedQuantity > 1) setSelectedQuantity((prev) => prev - 1)
  }

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error('Vui lòng chọn size và màu sắc trước khi thêm vào giỏ hàng!', { duration: 1000 })
      return
    }
    setIsButtonDisabled(true)
    dispatch(
      addToCart({
        productId,
        quantity: selectedQuantity,
        color: selectedColor,
        size: selectedSize,
        userId: user?._id,
        guestId,
      })
    ).then(() => {
      toast.success('Thêm vào giỏ hàng thành công!')
      setIsButtonDisabled(false)
    })
  }

  return (
    <div className='p-6'>
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg">
        <div className="flex flex-col md:flex-row">
          <div className="hidden md:flex flex-col space-y-4 mr-6">
            {loading
              ? Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} width={80} height={80} />)
              : selectedProduct?.images?.map((image, index) => (
                  <img
                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer ${
                      image.url === mainImage ? 'border' : ''
                    } hover:scale-105 transition-all duration-300`}
                    key={index}
                    src={image.url}
                    alt=""
                    onClick={() => setMainImage(image.url)}
                  />
                ))}
          </div>
          <div className="md:w-1/2">
            <div className="relative w-full aspect-square">
              {loading ? <Skeleton height="100%" width="100%" borderRadius="16px" /> : <img src={mainImage} alt="" className="absolute inset-0 w-full h-full object-cover rounded-lg" />}
            </div>
          </div>
          <div className="md:w-1/2 md:ml-10">
            <h1 className='text-2xl md:text-3xl font-bold mb-2'>{loading ? <Skeleton width={250} /> : selectedProduct?.name}</h1>
            <p className='text-xl text-gray-600 mb-4 font-semibold'>{loading ? <Skeleton width={100} /> : `${selectedProduct?.price} vnđ`}</p>
            <p className='text-gray-600 mb-4'>{loading ? <Skeleton count={3} /> : selectedProduct?.description}</p>

            <div className="mb-4">
              <p className="text-gray-700 mb-2 font-semibold">Màu: </p>
              <div className="flex gap-2 mt-2">
                {loading
                  ? Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} width={50} height={25} />)
                  : selectedProduct?.colors?.map((color, index) => (
                      <button
                        key={index}
                        className={`border px-2 py-1 cursor-pointer ${selectedColor === color ? 'bg-gray-200' : ''}`}
                        onClick={() => setSelectedColor(color)}
                      >
                        {color}
                      </button>
                    ))}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-gray-700 font-semibold">Size: </p>
              <div className="flex gap-2 mt-2">
                {loading
                  ? Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} width={40} height={25} />)
                  : selectedProduct?.sizes?.map((size, index) => (
                      <button key={index} className={`px-4 py-2 border cursor-pointer ${size === selectedSize ? 'bg-gray-300' : ''}`} onClick={() => setSelectedSize(size)}>
                        {size}
                      </button>
                    ))}
              </div>
            </div>

            <div className="mb-4">
              <p className='text-gray-700'>Số lượng</p>
              <div className="flex items-center space-x-4 mt-2">
                <button onClick={() => handleQuantityChange('minus')} className='cursor-pointer px-2 py-1 bg-gray-200 rounded text-lg'>-</button>
                <span className='text-lg'>{loading ? <Skeleton width={30} /> : selectedQuantity}</span>
                <button onClick={() => handleQuantityChange('plus')} className='cursor-pointer px-2 py-1 bg-gray-200 rounded text-lg'>+</button>
              </div>
            </div>

            <button
              disabled={isButtonDisabled || loading}
              onClick={handleAddToCart}
              className={`bg-gray-700 text-white py-2 px-6 rounded w-full mb-4 hover:bg-gray-600 cursor-pointer transition-all duration-300 ${isButtonDisabled ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              {isButtonDisabled ? 'Đang thêm vào giỏ hàng...' : loading ? <Skeleton width={150} height={30} /> : 'Thêm vào giỏ hàng'}
            </button>
          </div>
        </div>

        <div className="mt-20">
          <h2 className='text-2xl text-center font-medium mb-4'>{loading ? <Skeleton width={200} /> : 'Bạn có thể thích'}</h2>
          {loading ? <Skeleton height={200} /> : <ProductGrid products={similarProducts} />}
        </div>
      </div>
    </div>
  )
}

export default ProductsDetails
