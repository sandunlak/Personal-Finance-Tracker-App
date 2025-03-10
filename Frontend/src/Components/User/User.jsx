import React, { useContext } from 'react'
import './User.css'

import { AuthContext } from '../Context/AuthContext'

function User() {

  const { user } = useContext(AuthContext);

  return (
    <div className='user-container'>
      <h1>User DashBaord</h1>
      <p>Name {user.name}</p>
      <p>Email {user.email}</p>
    </div>
  )
}

export default User
