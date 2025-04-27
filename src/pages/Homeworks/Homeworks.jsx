import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Homeworks.module.css'; // можно переименовать в Homeworks.module.css
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
                sort_order: 'desc',
            };

            if (role === 'teacher') {
                params.teacherId = userId;
            } else {
                params.studentId = userId;
            }

            const response = await axios.get('/homeworks', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                },
                params
            });

            const homeworkList = response.data.students || [];

            const homeworksWithLinks = homeworkList.map(hw => ({
                ...hw,
                link: `/homework/${hw.id}`
            }));

            setHomeworks(homeworksWithLinks);
        } catch (error) {
            console.error('Ошибка при загрузке домашних заданий:', error.response ? error.response.data : error.message);
            if (error.response?.status === 401) {
                alert('Пожалуйста, войдите в систему');
            }
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
