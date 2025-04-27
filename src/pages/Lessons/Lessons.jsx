import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Lessons.module.css';
import Table from '../../components/Table/Table';
import LoadingWrapper from '../../components/Loader/LoadingWrapper';
import { AuthContext } from '../../utils/AuthContext';

const Lessons = () => {
    const [lessons, setLessons] = useState(null);
    const { user } = useContext(AuthContext);
    const role = user?.role;
    const navigate = useNavigate();

    const loadLessons = async () => {
        try {
            const response = await axios.get('/lessons', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                params: {
                    page: 1,
                    per_page: 100,
                    sort_by: 'date_created',
                    sort_order: 'desc'
                }
            });

            const lessonList = role === 'teacher' 
                ? response.data.ownerLessons 
                : response.data.followerLessons;

            const lessonsWithLinks = lessonList.map(lesson => ({
                ...lesson,
                link: `/lesson/${lesson.id}`
            }));

            setLessons(lessonsWithLinks || []);
        } catch (error) {
            console.error('Failed to load lessons:', error.response ? error.response.data : error.message);
            if (error.response?.status === 401) {
                alert('Пожалуйста, войдите в систему');
            }
            setLessons([]);
        }
    };

    const columns = [
        { header: 'Название', accessor: item => item.name },
        { header: 'Предмет', accessor: item => item.subject },
        { header: 'Дата начала', accessor: item => new Date(item.startTime).toLocaleString() },
        { header: 'Дата окончания', accessor: item => new Date(item.endTime).toLocaleString() },
    ];

    return (
        <LoadingWrapper onLoad={loadLessons} shouldLoad={!lessons}>
            <div className={styles.container}>
                <h1 className={styles.title}>Мои занятия</h1>
                <Table columns={columns} data={lessons || []} />
                {role === 'teacher' && (
                    <button
                        className={styles.button}
                        onClick={() => navigate('/events')}
                    >
                        Перейти к мероприятиям
                    </button>
                )}
            </div>
        </LoadingWrapper>
    );
};

export default Lessons;
