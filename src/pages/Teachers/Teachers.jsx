import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Teachers.module.css';
import Table from '../../components/Table/Table';

const Teachers = () => {
    const [teachers, setTeachers] = useState([]);

    const loadTeachers = async () => {
        try {
            const response = await axios.get('http://localhost:3001/teachers', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            console.log('Teachers data:', response.data); // Для отладки
            // Добавляем поле link для каждой записи
            const teachersWithLinks = response.data.map(teacher => ({
                ...teacher,
                link: `/teacher/${teacher.id}` // Предполагается, что id есть в данных
            }));
            setTeachers(teachersWithLinks || []);
        } catch (error) {
            console.error('Failed to load teachers:', error.response ? error.response.data : error.message);
            if (error.response?.status === 401) {
                alert('Пожалуйста, войдите в систему');
            }
        }
    };

    useEffect(() => {
        loadTeachers();
    }, []);

    const columns = [
        // { header: 'ID', accessor: item => item.id }, // Добавляем колонку для ID
        { header: 'Имя', accessor: item => item.firstName },
        { header: 'Фамилия', accessor: item => item.lastName },
        { header: 'Почта', accessor: item => item.email }
    ];

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Список учителей</h1>
            <Table columns={columns} data={teachers} />
        </div>
    );
};

export default Teachers;