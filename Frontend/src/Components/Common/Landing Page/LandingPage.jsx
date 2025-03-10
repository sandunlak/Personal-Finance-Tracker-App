import React from 'react'
import './LandingPage.css'
import { Link } from 'react-router-dom'

function LandingPage() {
    return (
        <div className='landing-page-container'>
            <h1>Landing Page</h1>

            <button className='login-btn'>
                <Link to='/login'>Login</Link> </button>

            <button className='register-btn'>
                <Link to='/register'>Register</Link></button>
        </div>
    )
}

export default LandingPage
