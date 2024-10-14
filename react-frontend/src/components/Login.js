import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [Email,SetEmail] = useState('');
    const [Password,SetPassword] = useState('');
    const [error,seterror] = useState('');
    const navigate = useNavigate();
    const BACKEND_URL = 'http://localhost:8000/api'

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${BACKEND_URL}/login`,{
                email : Email,
                password : Password
            });
            console.log("User is logging in with",Email);
            localStorage.setItem('token', response.data.access_token);
            navigate('/dashboard');
        } catch (err) {
            seterror('Login Details Incorrect');
            console.error(err);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            {error && <p style={{color: 'red'}}>{error}</p>}
            <form onSubmit={handleLogin}>
                <div>
                    <input type='email' name='email' value={Email} onChange={(e) => SetEmail(e.target.value)} required />
                </div>
                <div>
                    <input type='password' name='password' value={Password} onChange={(e) => SetPassword(e.target.value)} required />
                </div>
                <button type='submit'>Login</button>
            </form>
        </div>
    );
};

export default Login;