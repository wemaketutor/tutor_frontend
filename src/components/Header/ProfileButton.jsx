import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import { AuthContext } from '../../utils/AuthContext';
import translateRole from '../../utils/translateRole';

const ProfileButton = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const role = user?.role;

    const getLinkClass = () => {
        return window.location.pathname === '/profile' ? styles.textSecondary : styles.textWhite;
    };

    return (
        <div className={styles.profileButton}>
            <div className={styles.userInfo}>
                <p
                    className={`${styles.navLink} ${getLinkClass()}`}
                    onClick={() => navigate('/profile')}
                >
                    {user?.email || ''}
                </p>
                <p
                    className={`${styles.navLink} ${getLinkClass()}`}
                    onClick={() => navigate('/profile')}
                >
                    {translateRole(role) || ''}
                </p>
            </div>
            <img className={styles.userIcon}
                width="50px"
                src="/src/assets/user-icon.svg"
                alt="User Icon"
                onClick={() => navigate('/profile')}></img>
        </div>
    );
};

export default ProfileButton;