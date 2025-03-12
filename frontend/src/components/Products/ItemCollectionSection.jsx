import React from 'react'
import topCollectionImage from '../../assets/Top/1.jpg'
import botCollectionImage from '../../assets/Bot/1.jpg'
import hatCollectionImage from '../../assets/Hat/1.jpg'
import bagCollectionImage from '../../assets/Bag/1.jpg'
import { Link } from 'react-router-dom'

const ItemCollectionSection = () => {
  return (
    <section className='py-16 px-8'>
        <div className="container mx-auto text-center">
            <h2 className='text-3xl font-bold mb-8'>Bộ sưu tập</h2>
        </div>
        <div className="container mx-auto flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 px-8">
            <div className="relative shadow-2xl ">
                <img src={topCollectionImage} alt="Bộ sưu tập Áo" className='rounded w-full aspect-square object-cover hover:scale-105 transition-all duration-300'/>
                <div className="absolute bottom-8 left-8 bg-white/80 p-4 rounded"> 
                    <h2 className='text-2xl font-bold text-gray-900 mb-2'>
                        Áo
                    </h2>
                    <Link to='/collections/all?item=top' className='text-gray-900'>Mua ngay</Link>
                </div>
            </div>
            <div className="relative shadow-2xl ">
                <img src={botCollectionImage} alt="Bộ sưu tập Áo" className='rounded w-full aspect-square object-cover hover:scale-105 transition-all duration-300'/>
                <div className="absolute bottom-8 left-8 bg-white/80 p-4 rounded"> 
                    <h2 className='text-2xl font-bold text-gray-900 mb-2'>
                        Quần
                    </h2>
                    <Link to='/collections/all?item=bot' className='text-gray-900'>Mua ngay</Link>
                </div>
            </div>
            <div className="relative shadow-2xl ">
                <img src={hatCollectionImage} alt="Bộ sưu tập Áo" className='rounded w-full aspect-square object-cover hover:scale-105 transition-all duration-300'/>
                <div className="absolute bottom-8 left-8 bg-white/80 p-4 rounded"> 
                    <h2 className='text-2xl font-bold text-gray-900 mb-2'>
                        Mũ
                    </h2>
                    <Link to='/collections/all?item=hat' className='text-gray-900'>Mua ngay</Link>
                </div>
            </div>
            <div className="relative shadow-2xl ">
                <img src={bagCollectionImage} alt="Bộ sưu tập Áo" className='rounded w-full aspect-square object-cover hover:scale-105 transition-all duration-300'/>
                <div className="absolute bottom-8 left-8 bg-white/80 p-4 rounded"> 
                    <h2 className='text-2xl font-bold text-gray-900 mb-2'>
                        Túi
                    </h2>
                    <Link to='/collections/all?item=bag' className='text-gray-900'>Mua ngay</Link>
                </div>
            </div>
        </div>
    </section>
  )
}

export default ItemCollectionSection