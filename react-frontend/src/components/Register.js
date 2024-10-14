import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [Username,SetUsername] = useState('');
    const [Email,SetEmail] = useState('');
    const [Password,SetPassword] = useState('');
    const [CPassword,SetCPassword] = useState('');
    const navigate = useNavigate();
    const BACKEND_URL = 'http://localhost:8000/api'
    const [error,seterror] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        if (Password !== CPassword) {
            seterror('Passwords do not match!');
            return;
        }
        try{
            const response = await axios.post(`${BACKEND_URL}/register`,{
                name : Username,
                email: Email,
                password : Password,
                password_confirmation : CPassword
            });
            console.log("User is registering with email",Email);    
            localStorage.setItem('token', response.data.access_token);            // Move Page to Login
            navigate('/login');
        } catch (err) {
            seterror('Registration Failed. Try Again');
            console.error(err);
        }
    };

    return (
        <div>
            <h2>Register</h2>
            {error && <p style={{ color: 'red'}}>{error}</p>}
            <div>
                <form onSubmit={handleRegister}>
                    <div>
                        <input name='Username' type='text' value={Username} onChange={(e) => SetUsername(e.target.value)} required />
                    </div>
                    <div>
                        <input name='Email' type='email' value={Email} onChange={(e) => SetEmail(e.target.value)} required />
                    </div>
                    <div>
                        <input name='Password' type='password' value={Password} onChange={(e) => SetPassword(e.target.value)} required />
                    </div>
                    <div>
                        <input name='CPassword' type='password' value={CPassword} onChange={(e) => SetCPassword(e.target.value)} required />
                    </div>
                    <button type='submit'>Register</button>
                </form>
            </div>
        </div>
    );
};

export default Register;