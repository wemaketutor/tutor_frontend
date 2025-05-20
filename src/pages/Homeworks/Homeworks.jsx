import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Homeworks.module.css';
import Table from '../../components/Table/Table';
import LoadingWrapper from '../../components/Loader/LoadingWrapper';
import { AuthContext } from '../../utils/AuthContext';

const Homeworks = () => {
    const [homeworks, setHomeworks] = useState(null);
    const { user } = useContext(AuthContext);
    const role = user?.role;
    const userId = user?.id;
    const navigate = useNavigate();

    const loadHomeworks = async () => {
        try {
            const params = {
                page: 1,
                per_page: 100,
                sort_by: 'dueDate',
                sort_order: 'desc'
            };
            
            if (role === 'teacher') {
                params.teacherId = userId;
            } else {
                params.studentId = userId;
            }
            
            const response = await axios.get('/homeworks', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                params
            });

            // Пробуем все возможные пути получения данных
            const responseData = response.data;
            let homeworkList = [];
            
            if (responseData.students && responseData.students.length > 0) {
                homeworkList = responseData.students;
            } else if (responseData.homeworks && responseData.homeworks.length > 0) {
                homeworkList = responseData.homeworks;
            } else if (Array.isArray(responseData)) {
                homeworkList = responseData;
            }

            const homeworksWithLinks = homeworkList.map(homework => ({
                ...homework,
                link: `/homework/${homework.id}`
            }));

            setHomeworks(homeworksWithLinks);
        } catch (error) {
            console.error('Ошибка загрузки:', error.response ? error.response.data : error.message);
            setHomeworks([]);
        }
    };

    const columns = [
        { header: 'Заголовок', accessor: item => item.title },
        { header: 'Описание', accessor: item => item.description },
        { header: 'Статус', accessor: item => item.status },
        { header: 'Срок сдачи', accessor: item => new Date(item.dueDate).toLocaleString() },
        ...(role === 'teacher'
            ? [{ header: 'Оценка', accessor: item => item.grade ?? '—' }]
            : [])
    ];

    return (
        <LoadingWrapper onLoad={loadHomeworks} shouldLoad={!homeworks}>
            <div className={styles.container}>
                <h1 className={styles.title}>Мои домашние задания</h1>
                <Table columns={columns} data={homeworks || []} />
                {role === 'teacher' && (
                    <button
                        className={styles.button}
                        onClick={() => navigate('/homeworks/new')}
                    >
                        Новое задание
                    </button>
                )}
            </div>
        </LoadingWrapper>
    );
};

export default Homeworks;
