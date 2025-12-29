import Header from '@/components/header'
import { Outlet } from 'react-router-dom'

const AppLayout = () => {
return (
    <div className='bg-grid-white/[0.05]'>
       
        
     
            <main className='min-h-screen mx-auto max-w-6xl px-2 rounded-lg'>
                    {/* Header*/}
                    <Header />
                    <Outlet />
            </main>
            <br />

            {/* made by me section */}
            <a 
                href="https://rohitdebnath.me" 
                target="_blank" 
                rel="noopener noreferrer" 
                className='fixed bottom-4 right-4 flex items-center gap-2 bg-background/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-border hover:border-primary transition-all duration-200 z-50 shadow-lg'
            >
                <span className='text-sm font-medium'>Built by Rohit</span>
                <span className='text-primary'>♥</span>
            </a>
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