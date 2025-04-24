import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';

const NavLink = ({ page, children }) => {
    const navigate = useNavigate();
    const getLinkClass = () => {
        return location.pathname === `/${page}` ? styles.textSecondary : styles.textWhite;
    };

    return (
        <li>
            <a
                className={`${styles.navLink} ${getLinkClass()}`}
                onClick={() => navigate(`/${page}`)}
            >
                {children}
            </a>
        </li>
    );
};

export default NavLink;
