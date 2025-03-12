import React, { useState } from 'react'
import AdminSidebar from './AdminSidebar'
import { Outlet } from 'react-router-dom'

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className='min-h-screen flex flex-col lg:flex-row relative'>
        <AdminSidebar toggleSidebar={toggleSidebar}  isSidebarOpen={isSidebarOpen} /> 
        <div className="flex-grow p-6 overflow-auto">
            <Outlet />
        </div>
    </div>
  )
}

export default AdminLayout