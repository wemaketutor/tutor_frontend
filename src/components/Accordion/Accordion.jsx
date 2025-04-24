import React, { useState } from 'react';
import styles from './Accordion.module.css';

const Accordion = ({
    data = [],
    defaultOpenIndexes = [],
    allowMultipleOpen = false,
    title = '',
}) => {
    const [openIndexes, setOpenIndexes] = useState(defaultOpenIndexes);

    const toggleItem = (index) => {
        if (allowMultipleOpen) {
            setOpenIndexes((prev) =>
                prev.includes(index)
                    ? prev.filter((i) => i !== index)
                    : [...prev, index]
            );
        } else {
            setOpenIndexes(openIndexes[0] === index ? [] : [index]);
        }
    };

    return (
        <div className={styles.container}>
            {title && <h1 className={styles.title}>{title}</h1>}
            <div className={styles.accordion}>
                {data.map((item, index) => (
                    <div key={index} className={styles.accordionItem}>
                        <h2 className={styles.accordionHeader}>
                            <button
                                className={`${styles.accordionButton} ${!openIndexes.includes(index) ? styles.collapsed : ''}`}
                                type="button"
                                onClick={() => toggleItem(index)}
                                aria-expanded={openIndexes.includes(index)}
                                aria-controls={`collapse-${index}`}
                            >
                                {item.question}
                            </button>
                        </h2>
                        <div
                            id={`collapse-${index}`}
                            className={`${styles.accordionCollapse} ${openIndexes.includes(index) ? styles.show : ''}`}
                            aria-labelledby={`heading-${index}`}
                        >
                            <div className={styles.accordionBody}>
                                {item.answer}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Accordion;
