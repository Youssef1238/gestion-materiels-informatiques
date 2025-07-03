import { Link, useNavigate } from "react-router-dom"
import Cookies from 'js-cookie'
import { useEffect, useState } from "react"
import {Home,Parametre,LogOut,Edit} from "../assets/NavIcons"


export default function NavBar() {

    const Navigate = useNavigate()
    const [Focus,setFocus] = useState(null)
    const id = Cookies.get('id')

    const Logout = ()=>{
        Cookies.remove('id')
        Cookies.remove('admin')
        Navigate('/login')
        
    }

    return(
        <nav className="bg-[#1A202C] w-full p-5 flex gap-3 justify-evenly">
            <Link className="cursor-pointer flex justify-center items-center" to='/' onMouseEnter={()=>setFocus(0)} onMouseLeave={()=>setFocus(null)}><Home h={"40px"} w={"40px"} Hover={Focus==0} Active={window.location.href.split('/').at(-1) == ""}/></Link>
            <Link className="text-white cursor-pointer text-[1.2rem]" to='/Edit' onMouseEnter={()=>setFocus(1)} onMouseLeave={()=>setFocus(null)}><Edit h={"40px"} w={"40px"} Hover={Focus==1} Active={window.location.href.split('/').at(-1) == "Edit"}/></Link>
            <Link className="cursor-pointer flex justify-center items-center" to='/parametre' onMouseEnter={()=>setFocus(2)} onMouseLeave={()=>setFocus(null)}><Parametre h={"40px"} w={"40px"} Hover={Focus==2} Active={window.location.href.split('/').at(-1) == "parametre"}/></Link>
            {id?<Link className="cursor-pointer flex justify-center items-center" onClick={()=>Logout()} onMouseEnter={()=>setFocus(3)} onMouseLeave={()=>setFocus(null)}><LogOut h={"40px"} w={"40px"} Hover={Focus==3}/></Link> :null}
        </nav>
    )
}