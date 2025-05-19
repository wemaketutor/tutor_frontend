import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from './AuthForm';
import styles from './Auth.module.css';
import { AuthContext } from '../../utils/AuthContext.jsx';
import { toast } from 'react-toastify';

const Login = () => {
    const [user, setUser] = useState({
        email: '',
        password: ''
    });
    const [message, setMessage] = useState('');
    const [successful, setSuccessful] = useState(false);
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login(user);
            setMessage({ message: 'Login successful' });
            setSuccessful(true);
            toast.success('Вход выполнен успешно!');

            // Редирект после успешного логина
            const redirectPath = localStorage.getItem('redirectAfterLogin');
            if (redirectPath) {
                localStorage.removeItem('redirectAfterLogin');
                navigate(redirectPath);
            } else {
                navigate('/');
            }
        } catch (error) {
            if (error.response) {
                setMessage(error.response.data);
                toast.error('Не удалось войти!');
                setSuccessful(false);
                console.error('Login error:', error.response.data);
            } else {
                setMessage({ message: 'Network error or server is unavailable' });
                setSuccessful(false);
                console.error('Login error:', error.message);
            }
        }
    };

    const fields = [
        {
            id: 'email',
            name: 'email',
            type: 'email',
            label: 'Почта:',
            value: user.email,
            required: true
        },
        {
            id: 'password',
            name: 'password',
            type: 'password',
            label: 'Пароль:',
            value: user.password,
            required: true
        }
    ];

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Вход</h2>
            <AuthForm
                fields={fields}
                handleInputChange={handleInputChange}
                onSubmit={handleLogin}
                submitText="Войти"
            />
            {message && (
                <div className={`${styles.alert} ${successful ? styles.alertSuccess : styles.alertDanger}`}>
                    {message.message}
                </div>
            )}
        </div>
    );
};

export default Login;
