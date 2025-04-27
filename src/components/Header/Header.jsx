import React, { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NavLink from './NavLink';
import ProfileButton from './ProfileButton';
import AuthButton from './AuthButton';
import styles from './Header.module.css';
import { AuthContext } from '../../utils/AuthContext.jsx';

const Header = () => {
    const { user, isAuthenticated } = useContext(AuthContext);
    const location = useLocation();
    const role = user?.role;
    const isTeacher = role === 'teacher';
    const isStudent = role === 'student';

    useEffect(() => {
        // console.log('Header updated:', { isAuthenticated, user, pathname: location.pathname });
    }, [isAuthenticated, user, location.pathname]);

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <div className={styles.flexContainer}>
                    <a href="/" className={styles.logoLink}>
                        <div className={styles.logo}>
                            <img
                                src="/src/assets/logo-white.svg"
                                className={styles.logoImg}
                                width="50px"
                                alt="Logo"
                            />
                            <span className={styles.title}>Tutoring assistant</span>
                        </div>
                    </a>

                    <ul className={styles.nav}>
                        <NavLink page="">Главная</NavLink>
                        {isTeacher ? (
                            <>
                                <NavLink page="lessons">Уроки</NavLink>
                                <NavLink page="homeworks">Задания</NavLink>
                                <NavLink page="teachers">Преподаватели</NavLink>
                                <NavLink page="materials">Материалы</NavLink>
                            </>
                        ) : isStudent ? (
                            <>
                                <NavLink page="lessons">Уроки</NavLink>
                                <NavLink page="homeworks">Задания</NavLink>
                                <NavLink page="teachers">Преподаватели</NavLink>
                                <NavLink page="materials">Материалы</NavLink>
                            </>
                        ) : <>
                        <NavLink page="about">Наша история</NavLink>
                        <NavLink page="QA">Вопросы и ответы</NavLink>
                         </>
                        }
                    </ul>

                    <div className={styles.textEnd}>
                        {!isAuthenticated ? (
                            <>
                                <AuthButton type="login" />
                                <AuthButton type="register" />
                            </>
                        ) : (
                            <ProfileButton />
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;