import React from 'react';
import styles from './Auth.module.css';

const AuthForm = ({ fields, handleInputChange, onSubmit, submitText }) => {
    return (
        <form onSubmit={onSubmit} className={styles.form}>
            <div className={styles.formGroup}>
                {fields.map((field) => (
                    <div key={field.id}>
                        <label htmlFor={field.id} className={styles.formLabel}>{field.label}</label>
                        {field.type === 'select' ? (
                            <select
                                id={field.id}
                                name={field.name}
                                className={styles.formSelect}
                                required={field.required}
                                value={field.value}
                                onChange={handleInputChange}
                            >
                                {field.options.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input
                                id={field.id}
                                name={field.name}
                                type={field.type}
                                className={styles.formInput}
                                required={field.required}
                                value={field.value}
                                onChange={handleInputChange}
                            />
                        )}
                    </div>
                ))}
                <button type="submit" className={styles.submitButton}>{submitText}</button>
            </div>
        </form>
    );
};

export default AuthForm;