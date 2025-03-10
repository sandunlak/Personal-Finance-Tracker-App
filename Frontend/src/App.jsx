import React, { useContext } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthContext } from './Components/Context/AuthContext'

import Admin from './Components/Admin/Admin'
import User from './Components/User/User'
import CourseProvider from './Components/CourseProvider/CourseProvider'
import Header from './Components/Common/Header/Header'
import Footer from './Components/Common/Footer/Footer'
import LandingPage from './Components/Common/Landing Page/LandingPage'
import Login from './Components/Common/Login/Login'
import Register from './Components/Common/Register/Register'

function App() {

  const { user } = useContext(AuthContext);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path='/register' element={<Register />} />
        {user ? (
          <>
            {user.role === "admin" && (
              <>
                <Route path='/adminDashBoard' element={<Admin />} />
              </>
            )}
            {user.role === "courseProvider" && (
              <>
                <Route path='/courseProviderDashBoard' element={<CourseProvider />} />
              </>
            )}
            {user.role === "user" && (
              <>
                <Route path="/userDashBoard" element={<User />} />
              </>
            )}
          </>
        ) : (
          <>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path='/register' element={<Register />} />
          </>
        )}
      </Routes>
      <Footer />
    </>
  )
}

export default App
