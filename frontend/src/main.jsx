import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider , createBrowserRouter } from 'react-router-dom'
import ProtectedRoute from './auth/ProtectedRoute.jsx'
import Login from './pages/Login.jsx'
import Page404 from './pages/Page404.jsx'
import ServerError from './pages/ServerError.jsx'
import Acceuil from './pages/Acceuil.jsx'
import { AuthProvider } from './auth/authContext.jsx'
import {
  Chart as ChartJS,
  registerables
} from 'chart.js';
import Manage from './pages/Manage.jsx'
import Marché from './pages/Marché.jsx'
import EntitéAdmin from './pages/EntiteAdmin.jsx'
import Manual from './pages/Manual.jsx'

ChartJS.register(...registerables);


const router = createBrowserRouter(
  [
    {
      path : '*',
      element : 
      <Page404/>
    },
    {
      path : '/error',
      element :
       <ServerError/>
    },
    {
      path : '/',
      element :
      <ProtectedRoute>
        <Acceuil/>
      </ProtectedRoute>  
    },
    {
      path : '/Login',
      element : <Login/>
    },
    {
      path : "/Gerer",
      element :
      <ProtectedRoute>
        <Manage/>
      </ProtectedRoute>  
    },
    {
      path : "/Marché",
      element :
      <ProtectedRoute>
        <Marché/>
      </ProtectedRoute>  
    },
    {
      path : "/EntitéAdmin",
      element :
      <ProtectedRoute>
        <EntitéAdmin/>
      </ProtectedRoute>  
    },
    {
      path : "/Manuelle",
      element :
      <ProtectedRoute>
        <Manual/>
      </ProtectedRoute>  
    },

    
  ]
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router}/>
    </AuthProvider>
  </StrictMode>,
)
