import { createBrowserRouter, RouterProvider, } from 'react-router-dom';
import './App.css'
import React from 'react'
import './index.css'
import AppLayout from './layouts/app-layout';
import Dashboard from './pages/dashboard';
import LandingPage from './pages/landing';
import Auth from './pages/auth';
import Link from './pages/link';
import RedirectLink from './pages/redirect-link';



const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path : '/',
      element: <LandingPage />
      },
      {
        path : '/dashboard',
      element: <Dashboard />
      },
      {
        path : '/auth',
      element: <Auth />
      },
      {
        path : '/link/:id',
      element: <Link />
      },
      {
        path : '/:id',
      element: <RedirectLink />
      },


    ]
  }
])

function App() {
  

  return <RouterProvider router={router} />

  
}

export default App
