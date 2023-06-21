import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { FaBookReader, FaBook, FaBlog } from 'react-icons/fa'
import { ImBooks} from "react-icons/im";
import { IoMenuOutline, IoCloseOutline } from "react-icons/io5";

const Sidebar = ({children}) => {

    const [isOpen, setisOpen] = useState(false)
    const toggle = () => setisOpen(!isOpen)

    function navClose() {
      setisOpen(false)
    }
    
    const menuItems = [
        {
            path: "/",
            name: "Current Read",
            icon: <FaBookReader />
        },
        {
            path: "/recommendations",
            name: "Recommendations",
            icon:<FaBook />
        },
        {
            path: "/suggestion",
            name: "Suggestions",
            icon:<ImBooks />
        },
        {
            path: "/blogs",
            name: "Blogs",
            icon:<FaBlog />
        }
    ]

     return (
        <div className='container'>
            <div className='sidebar' style={{width: isOpen ? "100%" : "60px", height: isOpen ? '100vh': 'auto'}}>
              <div className='top-section'>
              <h2 className='logo' style={{display: isOpen ? "block" : "none", fontSize: "20px"}}>M Library Dashboard</h2>
              <div className='bars' style={{marginLeft: isOpen ? "50px" : "0px"}}>
                {isOpen ? <IoCloseOutline onClick={toggle}/>: <IoMenuOutline onClick={toggle}/>}
              </div>
              </div >
              {menuItems.map((items, index) =>(
                <NavLink to = {items.path} key = {index} className = "Link" activclassname = "active" onClick={navClose}>
                   <div className='icon'>{items.icon}</div>
                   <div className='link-text' style={{display: isOpen ? "block" : "none", marginLeft: '10px'}}>{items.name}</div>
                </NavLink>
              ))
              
              }
            </div>
            <main style={{display: isOpen ? "none" : "block"}}>{children}</main>
        </div>
     )
}

export default Sidebar
