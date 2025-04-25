import React, { useState } from 'react';
import axios from 'axios';
import styles from './Teachers.module.css';
import Table from '../../components/Table/Table';
import LoadingWrapper from '../../components/Loader/LoadingWrapper';

const Teachers = () => {
    const [teachers, setTeachers] = useState(null);

    const loadTeachers = async () => {
        try {
            const response = await axios.get('http://localhost:3001/teachers', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            // console.log('Teachers data:', response.data); // Для отладки
            const teachersWithLinks = response.data.map(teacher => ({
                ...teacher,
                link: `/teacher/${teacher.id}`
            }));
            setTeachers(teachersWithLinks || []);
        } catch (error) {
            console.error('Failed to load teachers:', error.response ? error.response.data : error.message);
            if (error.response?.status === 401) {
                alert('Пожалуйста, войдите в систему');
            }
            setTeachers([]);
        }
    };

    const columns = [
        { header: 'Имя', accessor: item => item.firstName },
        { header: 'Фамилия', accessor: item => item.lastName },
        { header: 'Почта', accessor: item => item.email }
    ];

    return (
        <LoadingWrapper onLoad={loadTeachers} shouldLoad={!teachers}>
            <div className={styles.container}>
                <h1 className={styles.title}>Список преподавателей</h1>
                <Table columns={columns} data={teachers || []} />
            </div>
        </LoadingWrapper>
    );
};

export default Teachers;