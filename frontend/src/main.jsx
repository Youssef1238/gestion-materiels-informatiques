import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider , createBrowserRouter } from 'react-router-dom'
import ProtectedRoute from './auth/ProtectedRoute.jsx'
import Login from './pages/Login.jsx'
import Page404 from './pages/Page404.jsx'
import Parametere from './pages/Parametre.jsx'
import Edit from './pages/Edit.jsx'
import ServerError from './pages/ServerError.jsx'
import Acceuil from './pages/Acceuil.jsx'
import { AuthProvider } from './auth/authContext.jsx'


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
      path : "/Edit",
      element :
      <ProtectedRoute>
        <Edit/>
      </ProtectedRoute>  
    },

    {
      path : '/parametre',
      element :
      <ProtectedRoute>
        <Parametere/>
      </ProtectedRoute>   
    }
  ]
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router}/>
    </AuthProvider>
  </StrictMode>,
)
