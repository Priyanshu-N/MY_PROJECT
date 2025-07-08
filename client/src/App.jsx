import { useState } from 'react'

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import Header from './components/Header'
import PrivateRoute from './components/PrivateRoute'
import CreateListing from './pages/CreateListing'
import Listing from './pages/Listing';
import UpdateListing from './pages/updateListing'
import Search from './pages/Search'




function App() {

  return (
  <BrowserRouter>
    <Header />
    <Routes>
    
      <Route path="/" element={<Home />} />
      <Route path="/About" element={<About/>} />
      <Route path="/Signin" element={<Signin/>} />
      <Route path="/Signup" element={<Signup/>} />
      <Route path="/Search" element={<Search />} />

      {/* Private Routes */}


      <Route element={<PrivateRoute />}>
        <Route path="/Profile" element={<Profile />} />
        <Route path="/create-listing" element={<CreateListing />} />
        <Route path="/update-listing/:listingId" element={<UpdateListing />} />
      </Route>
      <Route path="/listing/:listingId" element={<Listing />} />
      
  </Routes>

  </BrowserRouter>
  ) 

}

export default App