import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Table.module.css';

const Table = ({ columns, data }) => {
    const navigate = useNavigate();

    const handleRowClick = (link) => {
        if (link) {
            navigate(link);
        }
    };

    return (
        <div className={styles.tableContainer}>
            <div className={styles.headerRow}>
                {columns.map((col, index) => (
                    <div key={index} className={styles.headerCell}>
                        {col.header}
                    </div>
                ))}
            </div>
            {data.map((item, rowIndex) => {
                const isClickable = !!item.link;
                return (
                    <div
                        key={rowIndex}
                        className={`${styles.dataRow} ${isClickable ? styles.clickableRow : ''}`}
                        onClick={() => handleRowClick(item.link)}
                    >
                        {columns.map((col, colIndex) => (
                            <div key={colIndex} className={styles.dataCell}>
                                {col.accessor(item)}
                            </div>
                        ))}
                    </div>
                );
            })}
        </div>
    );
};

export default Table;
