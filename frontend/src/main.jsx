import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider , createBrowserRouter } from 'react-router-dom'

import Login from './pages/Login.jsx'
import Page404 from './pages/Page404.jsx'
import Parametere from './pages/Parametre.jsx'
import Edit from './pages/Edit.jsx'
import ServerError from './pages/ServerError.jsx'
import Acceuil from './pages/Acceuil.jsx'


const router = createBrowserRouter(
  [
    {
      path : '*',
      element : <Page404/>
    },
    {
      path : '/error',
      element : <ServerError/>
    },
    {
      path : '/',
      element : <Acceuil/>
    },
    {
      path : '/Login',
      element : <Login/>
    },
    {
      path : "/Edit",
      element : <Edit/>
    },

    {
      path : '/parametre',
      element : <Parametere/>
    }
  ]
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
