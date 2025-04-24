import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
    const navigate = useNavigate();

    const goPage = (name) => {
        navigate(`/${name}`);
    };

    return (
        <footer className={styles.footer}>
            <div className={styles.row}>
                <div className={styles.col1}>
                    <a href="/" className={styles.logoLink}>
                        <img
                            src="/src/assets/logo-black.svg"
                            alt="Tutoring Assistant Logo"
                            width="50px"
                        />
                        <span className={styles.title}>Tutoring assistant</span>
                    </a>
                </div>

                <div className={styles.colEmpty}></div>

                <div className={styles.col2}>
                    <h5>Навигация</h5>
                    <ul className={styles.nav}>
                        <li className={styles.navItem}>
                            <a
                                onClick={() => navigate('/')}
                                className={styles.navLink}
                            >
                                Главная
                            </a>
                        </li>
                        <li className={styles.navItem}>
                            <a
                                onClick={() => navigate('timetable')}
                                className={styles.navLink}
                            >
                                Расписание
                            </a>
                        </li>
                        <li className={styles.navItem}>
                            <a
                                onClick={() => navigate('profile')}
                                className={styles.navLink}
                            >
                                Профиль
                            </a>
                        </li>
                    </ul>
                </div>

                <div className={styles.col3}>
                    <h5>О нас</h5>
                    <ul className={styles.nav}>
                        <li className={styles.navItem}>
                            <a
                                onClick={() => navigate('about')}
                                className={styles.navLink}
                            >
                                История создания
                            </a>
                        </li>
                        <li className={styles.navItem}>
                            <a
                                onClick={() => navigate('qa')}
                                className={styles.navLink}
                            >
                                Частые вопросы
                            </a>
                        </li>
                        <li className={styles.navItem}>
                            <a href="mailto:info@tutoring-assistant.ru" className={styles.navLink}>
                                email: info@tutoring-assistant.ru
                            </a>
                        </li>

                        <li className={styles.navItem}>
                            <a href="tel:+79528120001" className={styles.navLink}>
                                tel: +7(952)812-00-01
                            </a>
                        </li>

                    </ul>
                </div>

                <div className={styles.col4}>
                    <h5>Наши соцсети</h5>
                    <ul className={styles.nav}>
                        <li className={styles.navItem}>
                            <a href="https://t.me/TutoringAssistant" className={styles.navLink} target="_blank" rel="noopener noreferrer">
                                tg: @TutoringAssistant
                            </a>
                        </li>
                        <li className={styles.navItem}>
                            <a href="https://vk.com/tutoringassistant" className={styles.navLink} target="_blank" rel="noopener noreferrer">
                                vk: Tutoring Assistant
                            </a>
                        </li>
                    </ul>
                </div>

            </div>
            <p className={styles.copyright}>© <a className={styles.copyrightLink} href='https://tutoring-assistant.ru'>tutoring-assistant.ru</a> 2024</p>
        </footer>
    );
};

export default Footer;