import React, { useEffect, useRef, useState } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchNewArrival } from '../../redux/slices/productsSlice'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import Loading from '../Common/Loading'
const NewArrival = () => {
  const dispatch = useDispatch()
  const {newArrivalProducts, loading, error} = useSelector((state) => state.product)

  useEffect(() => {
    dispatch(fetchNewArrival())
  }, [dispatch])

  const scrollRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [canScrollLeft, setCanScrollLeft] = useState(false)

  const handleOnMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft)
    setScrollLeft(scrollRef.current.scrollLeft)
  }
  const handleOnMouseMove = (e) => {
    if(!isDragging) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  }
  const handleOnMouseUpOrLeave = (e) => {
    setIsDragging(false)
  }

  const scroll = (direction) => {
    const scrollAmount = direction === 'left' ? -300 : 300;
    scrollRef.current.scrollBy({left: scrollAmount, behavior: 'smooth'})
  }
  
  const updateScrollButton = () => {
    const container = scrollRef.current;

    if(container){
      const leftScroll = container.scrollLeft;
      const rightScrollable = container.scrollWidth > leftScroll + container.clientWidth;
      setCanScrollLeft(leftScroll > 0)
      setCanScrollRight(rightScrollable)
    }
  }

  useEffect(() => {
    const container = scrollRef.current;
    if(container) {
      container.addEventListener("scroll", updateScrollButton)
      updateScrollButton();
      return () => container.removeEventListener('scroll', updateScrollButton);
    }
  })
  if (loading){
    <Loading />
  }
  return (
    <section className='py-16'>
      <div className="container mx-auto text-center mb-10 relative px-8">
        <h2 className='text-3xl font-bold mb-4'>Hàng mới về</h2>
        <p className='text-lg text-gray-700 mb-4'>Khám phá những phong cách mới nhất, biến tủ quần áo của bạn thành một sàn diễn thời trang.</p>
        <div className="w-full flex justify-end space-x-2">
          <button onClick={() => scroll('left')} disabled={!canScrollLeft} className={`${canScrollLeft ? 'bg-white' : 'bg-gray-200'} cursor-pointer p-2 rounded-full border text-black`}>
              <FiChevronLeft className='text-2xl' />
          </button>
          <button onClick={() => scroll('right')} disabled={!canScrollRight} className={`${canScrollRight ? 'bg-white' : 'bg-gray-200'} cursor-pointer p-2 rounded-full border text-black`}>
              <FiChevronRight className='text-2xl' />
          </button>
        </div>
      </div>
      <div ref={scrollRef} onMouseDown={handleOnMouseDown} onMouseUp={handleOnMouseUpOrLeave} onMouseMove={handleOnMouseMove} className="hide-scrollbar container mx-auto overflow-x-scroll flex space-x-5 px-8 rounded-2xl">
        {loading
          ? Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex-none w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] relative">
                <Skeleton height="100%" width="100%" borderRadius="16px" />
              </div>
            ))
          : newArrivalProducts && newArrivalProducts.map((product) => (
              <div className="flex-none w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] relative" key={product.id}>
                <img className='w-full h-full object-cover rounded-2xl' draggable='false' src={product.images[0].url} alt="" />
                <div className="absolute bottom-0 left-0 right-0 backdrop-blur-md text-white p-4 rounded-b-2xl">
                  <Link to={`/product/${product._id}`} className='block'>
                    <h4 className='font-medium'>{product.name}</h4>
                    <p className='mt-1'>{product.price} vnđ</p>
                  </Link>
                </div>
              </div>
            ))}
      </div>
    </section>
  )
}

export default NewArrival