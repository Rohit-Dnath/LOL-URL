import Header from '@/components/header'
import React from 'react'
import { Outlet } from 'react-router-dom'

const AppLayout = () => {
  return (
    <div>
        <main className='min-h-screen container'>
            {/* Header*/}
            <Header />
            <Outlet />
        </main>
        <div className='bg-gray-800 text-white text-center p-4 mt-10'>
            {/* Footer */}
            Made with ❤️ by Rohit Debnath

        </div>

        
    </div>
  )
}

export default AppLayout