import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import Header from './components/Header'


function App() {

  return <BrowserRouter>
  <Header />
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/About" element={<About/>} />
    <Route path="/Signin" element={<Signin/>} />
    <Route path="/Signup" element={<Signup/>} />
    <Route path="/Profile" element={<Profile/>} />

  </Routes>

  </BrowserRouter>
      
  
}

export default App