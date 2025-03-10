import React from 'react'
import './Admin.css'
import { useContext } from 'react';

import { AuthContext } from '../Context/AuthContext'

function Admin() {

    const { user } = useContext(AuthContext)

    return (
        <div className='admin-container'>
            <h1>Admin DashBoard</h1>
            <p>Name {user.name}</p>
            <p>Email {user.email}</p>
            
        </div>

        
    )
}

export default Admin
