import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <>
      <head>
        <title>LOL URL - URL Shortener and Tracker</title>
        <meta name="description" content="Shorten, share, and track your URLs with LOL URL. Monitor click data, user engagement, and more." />
        <meta name="keywords" content="URL shortener, URL tracker, link shortener, link tracker, URL analytics" />
        <meta name="author" content="Rohit Debnath" />
        <meta property="og:title" content="LOL URL - Efficient URL Shortening and Tracking" />
        <meta property="og:description" content="Shorten, share, and track your URLs with LOL URL. Monitor click data, user engagement, and more." />
        <meta property="og:image" content="https://lolurl.site/og-image.jpg" />
        <meta property="og:url" content="https://lolurl.site" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="LOL URL - Efficient URL Shortening and Tracking" />
        <meta name="twitter:description" content="Shorten, share, and track your URLs with LOL URL. Monitor click data, user engagement, and more." />
        <meta name="twitter:image" content="https://lolurl.site/twitter-image.jpg" />
      </head>
      <App />
    </>
  </StrictMode>,
)
