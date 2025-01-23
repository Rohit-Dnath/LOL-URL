import Header from '@/components/header'
import React from 'react'
import { Outlet } from 'react-router-dom'

const AppLayout = () => {
return (
    <div className='bg-grid-white/[0.05]'>
            <main className='min-h-screen mx-auto max-w-6xl px-2 '>
                    {/* Header*/}
                    <Header />
                    <Outlet />
            </main>

            <div className='bg-gray-800 text-white text-center p-4 mt-10'>
                    {/* Footer */}
                    Made with ❤️ Rohit Debnath
            </div>

            {/* <div className='hidden sm:block' style={{ position: 'fixed', bottom: '50px', left: '10px', margin: '5px' }}>
                    <img href="https://rohitdebnath.com" className='cursor-pointer '
                            src="./egg.gif" 
                            alt="Easter Egg" 
                            width="75" 
                            height="75" 
                            style={{ transition: 'transform 0.3s' }} 
                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'} 
                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'} 
                    />
            </div> */}
            
    </div>
)
}

export default AppLayout