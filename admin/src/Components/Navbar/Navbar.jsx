import React from 'react' 
import logo from '../../assets/logo1.jpg';
import ProfileIcon from '../../assets/3.png';
import './Navbar.css';

const Navbar = () => {
  return (
    <div className="navbar"> 
      <img src={logo} alt="" className="nav-logo" /> 
      <img src={ProfileIcon} className="profileIcon" alt="" />
    </div>
  )
}

export default Navbar
