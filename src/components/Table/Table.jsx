import React from 'react';
import styles from './Table.module.css';

const Table = ({ columns, data }) => {
    return (
        <div className={styles.tableContainer}>
            <div className={styles.headerRow}>
                {columns.map((col, index) => (
                    <div key={index} className={styles.headerCell}>
                        {col.header}
                    </div>
                ))}
            </div>
            {data.map((item, rowIndex) => (
                <div key={rowIndex} className={styles.dataRow}>
                    {columns.map((col, colIndex) => (
                        <div key={colIndex} className={styles.dataCell}>
                            {col.accessor(item)}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Table;
