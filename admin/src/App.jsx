import React from 'react'
import Navbar from './Components/Navbar/Navbar.jsx'; 
import Sidebar from './Components/Navbar/Sidebar/Sidebar.jsx';
import Admin from './Pages/Admin/Admin.jsx';

const App = () => {
  return (
    <div>
      <Navbar></Navbar>  
      <Admin></Admin>
    </div>
  )
}

export default App
