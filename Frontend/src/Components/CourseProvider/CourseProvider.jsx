import React from 'react'
import './CourseProvider.css'
import { useContext } from 'react'

import { AuthContext } from '../COntext/AuthContext'

function CourseProvider() {

    const { user } = useContext(AuthContext)

    return (
        <div className='course-provider-container'>
            <h1>Course Provider DashBoard</h1>
            <p>Name {user.name}</p>
            <p>Email {user.email}</p>
        </div>
    )
}

export default CourseProvider
