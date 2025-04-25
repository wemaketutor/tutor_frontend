import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthForm from './AuthForm';
import styles from './Auth.module.css';

const Register = () => {
    const [user, setUser] = useState({
        email: '',
        password: '',
        role: 'teacher'
    });
    const [message, setMessage] = useState('');
    const [successful, setSuccessful] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value
        }));
    };

    const register = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/auth/register', user, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setMessage({ message: `Пользователь ${response.data.text} зарегистрирован.` });
            setSuccessful(true);
            navigate('/');
        } catch (error) {
            if (error.response) {
                setMessage(error.response.data);
            } else {
                setMessage({ message: 'Ошибка соединения с сервером' });
            }
            setSuccessful(false);
        }
    };

    const fields = [
        {
            id: 'email',
            name: 'email',
            type: 'email',
            label: 'Электронная почта:',
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
        },
        {
            id: 'role',
            name: 'role',
            type: 'select',
            label: 'Роль:',
            value: user.role,
            required: true,
            options: [
                { value: 'student', label: 'Ученик' },
                { value: 'teacher', label: 'Преподаватель' }
            ]
        }
    ];

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Регистрация</h2>
            <AuthForm
                fields={fields}
                handleInputChange={handleInputChange}
                onSubmit={register}
                submitText="Зарегистрироваться"
            />
            {message && (
                <div className={`${styles.alert} ${successful ? styles.alertSuccess : styles.alertDanger}`}>
                    {message.detail || message.message}
                </div>
            )}
        </div>
    );
};

export default Register;
