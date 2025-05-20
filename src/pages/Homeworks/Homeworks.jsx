import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Homeworks.module.css'; // можно переименовать в Homeworks.module.css
import Table from '../../components/Table/Table';
import LoadingWrapper from '../../components/Loader/LoadingWrapper';
import { AuthContext } from '../../utils/AuthContext';

const Homeworks = () => {
    const [homeworks, setHomeworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const role = user?.role;
    const userId = user?.id;
    const navigate = useNavigate();

    useEffect(() => {
        loadHomeworks();
    }, []);

    const loadHomeworks = async () => {
        setLoading(true);
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

            console.log('Загрузка домашних заданий с параметрами:', params);
            const response = await axios.get('/homeworks', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                },
                params
            });

            console.log('Полученные данные:', response.data);
            
            // Проверяем различные форматы данных
            const homeworkList = response.data.students || response.data.homeworks || [];
            console.log('Список домашних заданий:', homeworkList);

            const homeworksWithLinks = homeworkList.map(hw => ({
                ...hw,
                link: `/homework/${hw.id}`
            }));

            setHomeworks(homeworksWithLinks);
            console.log('Установлены домашние задания:', homeworksWithLinks);
        } catch (error) {
            console.error('Ошибка при загрузке домашних заданий:', error);
            console.error('Детали ошибки:', error.response ? error.response.data : error.message);
            if (error.response?.status === 401) {
                alert('Пожалуйста, войдите в систему');
            }
            setHomeworks([]);
        } finally {
            setLoading(false);
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
        <div className={styles.container}>
            <h1 className={styles.title}>Мои домашние задания</h1>
            {loading ? (
                <div className={styles.loading}>Загрузка...</div>
            ) : homeworks.length > 0 ? (
                <Table columns={columns} data={homeworks} />
            ) : (
                <div className={styles.noData}>Домашние задания не найдены</div>
            )}
            {role === 'teacher' && (
                <button
                    className={styles.button}
                    onClick={() => navigate('/homeworks/new')}
                >
                    Новое задание
                </button>
            )}
        </div>
    );
};

export default Homeworks;
