import React from 'react';
import styles from './Loader.module.css';

const Loader = ({ text = 'Загрузка...' }) => {
    return (
        <div className={styles.loaderContainer}>
            <div className={styles.loader}></div>
            <p className={styles.loaderText}>{text}</p>
        </div>
    );
};

export default Loader;