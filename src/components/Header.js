import React from 'react'
import logo from '../assets/Images/edify-logo.png';

function Header() {
  return (
    <div className="welcome-screen-header">
        <img src={logo} width={80} height={55} style={{scale:"crop"}} alt="Logo" />
    </div>
  )
}

export default Header
