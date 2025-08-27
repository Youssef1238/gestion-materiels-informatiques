import Footer from "./Footer"
import NavBar from "./NavBar"


export default function Layout({children}){
    return (
        <div className="w-full min-h-screen flex flex-col">
              <NavBar/>
              {children}
              <Footer/>
        
        </div>
    )
}