// AuthButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';

const AuthButton = ({ type }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (type === 'login') {
            navigate('login');
        } else if (type === 'register') {
            navigate('register');
        }
    };

    return (
        <button
            type="button"
            className={type === 'login' ? styles.btnOutlineLight : styles.btnSecondary}
            onClick={handleClick}
        >
            {type === 'login' ? 'Войти' : 'Зарегистрироваться'}
        </button>
    );
};

export default AuthButton;
