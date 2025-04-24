import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Teachers.module.css';
import Table from '../../components/Table/Table';

const Teachers = () => {
    const [teachers, setTeachers] = useState([]);

    const loadTeachers = async () => {
        try {
            const response = await axios.get('/teachers', {
                // headers: {
                //     'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                // }
            });
            setTeachers(response.data.teachers || []);
        } catch (error) {
            console.error('Failed to load teachers:', error.response ? error.response.data : error.message);
        }
    };

    useEffect(() => {
        loadTeachers();
    }, []);

    const columns = [
        { header: 'Почта', accessor: item => item.user.email },
        { header: 'Имя', accessor: item => item.user.firstName },
        { header: 'Фамилия', accessor: item => item.user.lastName },
        { header: 'Дополнительная информация', accessor: item => item.user.extraInfo }
    ];

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Список учителей</h1>
            <Table columns={columns} data={teachers} />
        </div>
    );
};

export default Teachers;
