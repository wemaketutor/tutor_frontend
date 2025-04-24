import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../utils/AuthContext.jsx';
import styles from './Profile.module.css';

const Profile = () => {
    const { user, logout, checkAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!checkAuth()) {
            navigate('/login', { replace: true });
        }
    }, [checkAuth, navigate]);

    const updateProfile = async (e) => {
        e.preventDefault();
        // Реализуйте обновление профиля, если нужно
    };

    const handleInputChange = (e) => {
        // Реализуйте изменение данных, если нужно
    };

    const handleLogout = async () => {
        try {
            // console.log('Initiating logout');
            await logout();
            // console.log('Logout completed, navigating to /home');
            // Задержка для гарантированного обновления состояния
            setTimeout(() => {
                navigate('/home', { replace: true });
            }, 0);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <form className={styles.container} onSubmit={updateProfile}>
            <h2 className={styles.title}>Профиль пользователя</h2>
            <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>Email:</label>
                <input
                    type="email"
                    id="email"
                    className={styles.input}
                    value={user?.email || ''}
                    disabled
                />
            </div>
            <button type="submit" className={styles.button}>Обновить профиль</button>
            <button type="button" className={styles.logoutButton} onClick={handleLogout}>
                Выйти
            </button>
        </form>
    );
};

export default Profile;