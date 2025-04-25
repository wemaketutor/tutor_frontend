import React from 'react';
import styles from './Home.module.css';

const Home = () => {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Добро пожаловать на Tutor Assistant!</h1>
            <p className={styles.subtitle}>
                Ваш путь к знаниям начинается здесь. Найдите лучших учителей и откройте новые горизонты обучения.
            </p>
        </div>
    );
};

export default Home;