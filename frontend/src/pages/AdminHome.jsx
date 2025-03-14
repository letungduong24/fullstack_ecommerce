import React, { useEffect } from 'react'
import { GrMoney } from "react-icons/gr";
import { FaUser } from "react-icons/fa";
import { FaBoxOpen } from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../components/Common/Loading';
import { fetchAllOrders } from '../redux/slices/adminOrderSlice';


const AdminHome = () => {
  const dispatch = useDispatch()
  const {order, loading, totalOrder, totalSales} = useSelector((state) => state.adminOrder)
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(fetchAllOrders({limit: 10}))
  }, [dispatch])
  if(loading){
    return <Loading />
  }

  return (
    <div className='flex flex-col h-full'>
        <h1 className='text-3xl font-bold mb-6'>Trang chủ</h1>
        <h2 className='mb-4 font-semibold text-2xl'>Thống kê</h2>
        <div className="grid sm:grid-cols-2 gap-6 mb-6">
            {totalOrder && totalSales ? (
                <>
                    <div className=" p-4 shadow-md rounded-lg flex-col flex items-center justify-center">
                        <h2 className=' font-semibold flex items-center gap-2 text-gray-600'>
                            <GrMoney className='hidden sm:block' />
                            Doanh thu
                        </h2>
                        <p className='text-2xl font-bold text-blue-600'>{totalSales.toFixed(2)}</p>
                    </div>
                    <div className="p-4 shadow-md rounded-lg flex-col flex items-center justify-center">
                        <h2 className=' font-semibold flex items-center gap-2 text-gray-600'>
                            <TbTruckDelivery className='hidden sm:block' />
                            Đơn hàng
                        </h2>
                        <p className='text-2xl font-bold text-blue-600'>{totalOrder}</p>
                    </div>
                </>
            ) : (
                <>
                    <div className="p-4 shadow-md rounded-lg flex-col flex items-center justify-center">
                        <h2 className=' font-semibold flex items-center gap-2 text-gray-600'>
                            <GrMoney className='hidden sm:block' />
                            Doanh thu
                        </h2>
                        <p className='text-2xl font-bold text-blue-600'>0</p>
                    </div>
                    <div className="p-4 shadow-md rounded-lg flex-col flex items-center justify-center">
                        <h2 className=' font-semibold flex items-center gap-2 text-gray-600'>
                            <TbTruckDelivery className='hidden sm:block' />
                            Đơn hàng
                        </h2>
                        <p className='text-2xl font-bold text-blue-600'>0</p>
                    </div>
                </>
            )}
            
        </div>
        <h2 className='mb-4 font-semibold text-2xl'>Đơn hàng gần đây</h2>
        <div className="w-full rounded-lg overflow-auto shadow-md">
            <table className="w-full border-separate border-spacing-0">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-2 first:rounded-tl-lg last:rounded-tr-lg">Mã đơn</th>
                        <th className="px-4 py-2">Tên khách</th>
                        <th className="px-4 py-2">Số điện thoại</th>
                        <th className="px-4 py-2">Trạng thái</th>
                        <th className="px-4 py-2 last:rounded-tr-lg">Thời gian</th>
                    </tr>
                </thead>
                <tbody>
                    {order && order.length>0 ? (order.map((order)=> (
                        <tr onClick={()=>{navigate(`/admin/orders/${order._id}`)}} className='hover:bg-gray-100 transition-all duration-300 cursor-pointer'>
                            <th className='px-4 py-3'>{order._id}</th>
                            <th className='px-4 py-3'>{order.name}</th>
                            <th className='px-4 py-3'>{order.phone}</th>
                            <th className={`px-4 py-3 
                                ${order.status === 'Chờ duyệt' ? 'text-amber-500' : ''}
                                ${order.status === 'Đang giao' ? 'text-blue-500' : ''}
                                ${order.status === 'Đã giao' ? 'text-emerald-800' : ''}
                                ${order.status === 'Đã hủy' ? 'text-red-500' : ''}
                            `}>{order.status}</th>
                            <th className='px-4 py-3'>{new Date(order.paidAt).toLocaleDateString()}</th>
                        </tr>
                    ))) : (
                        <tr>                            
                            <th colSpan={5} className='px-4 py-3'>Không có đơn hàng nào gần đây</th>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
  )
}

export default AdminHome