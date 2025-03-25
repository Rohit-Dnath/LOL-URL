import Header from '@/components/header'
import React from 'react'
import { Outlet } from 'react-router-dom'
import { Analytics } from "@vercel/analytics/react"

const AppLayout = () => {
return (
    <div className='bg-grid-white/[0.05]'>
       
        
     
            <main className='min-h-screen mx-auto max-w-6xl px-2 '>
                    {/* Header*/}
                    <Header />
                    <Outlet />
            </main>
            <br />

            {/* made by me section */}

            {/* <a 
                href="https://rohitdebnath.me" 
                target="_blank" 
                rel="noopener noreferrer" 
                className='fixed bottom-4 right-4 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full hover:bg-black/80 transition-all hover:scale-105 duration-200 z-50'
            >
                <span className='text-white text-xs'>Made by Rohit</span>
                <img 
                    src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExaHE5N2J4Ym0ybmhwbGlmbjlzMWQ2Z2RvMmw5dHd1MWR3ZjYwZ2N1NyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Oc8lIQHZsXqDu/giphy.gif"
                    alt="Hamster"
                    className='w-6 h-6 hover:scale-110 transition-transform duration-200 rounded-full'
                />
            </a> */}
            <script type="application/ld+json">
              {`
                {
                  "@context": "https://schema.org",
                  "@type": "WebSite",
                  "name": "LOL URL",
                  "url": "https://lolurl.site",
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://lolurl.site/search?q={search_term_string}",
                    "query-input": "required name=search_term_string"
                  }
                }
              `}
            </script>
    </div>
)
}

export default AppLayout