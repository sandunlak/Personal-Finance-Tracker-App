import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { useState } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import { jwtDecode } from 'jwt-decode';

function Login() {

    const { login } = useContext(AuthContext);

    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const loginForm = async (e) => {

        e.preventDefault();

        const response = await axios.post(`http://localhost:8000/api/users/login`, { name, password });

        const token = response.data.token;

        login(token);
        console.log(token); //debugging 

        const decode = jwtDecode(token);
        console.log(decode); //debugging

        if (decode.role === 'admin') {
            navigate('/adminDashBoard')
        } else if (decode.role === 'user') {
            navigate('/userDashBoard')

        } else if (decode.role === 'courseProvider') {
            navigate('/courseProviderDashBoard')
        } else {
            navigate('/');
        }
    }

    return (
        <div className='form-container'>
            <div className='form-card'>
                <h1>Login</h1>

                <form onSubmit={loginForm}>
                    <label>Name</label>
                    <input type='text'
                        value={name}
                        onChange={(e) => setName(e.target.value)} /> <br /><br />

                    <label>Password</label>
                    <input type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} /> <br /><br />

                    <button type='submit'>Login</button>
                </form>
            </div>
        </div>
    )
}

export default Login
