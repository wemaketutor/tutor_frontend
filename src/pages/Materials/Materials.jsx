import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Materials.module.css';
import Table from '../../components/Table/Table';
import LoadingWrapper from '../../components/Loader/LoadingWrapper';
import { AuthContext } from '../../utils/AuthContext';

const Materials = () => {
    const [materials, setMaterials] = useState(null);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const loadMaterials = async () => {
        try {
            // Проверка авторизации
            if (!user) {
                alert('Пожалуйста, войдите в систему');
                navigate('/login'); // Перенаправление на страницу входа
                return;
            }

            const params = {
                page: 1,
                per_page: 100,
                sort_by: 'title',
                sort_order: 'desc',
            };

            if (user.role === 'teacher') {
                params.teacherId = user.id;
            } else {
                params.studentId = user.id;
            }

            const response = await axios.get('/materials', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                params
            });

            const materialList = response.data.materials || [];

            const materialsWithLinks = materialList.map(material => ({
                ...material,
                link: `/material/${material.id}`
            }));

            setMaterials(materialsWithLinks);
        } catch (error) {
            console.error('Failed to load materials:', error.response ? error.response.data : error.message);
            if (error.response?.status === 401) {
                alert('Пожалуйста, войдите в систему');
                navigate('/login');
            } else if (error.response?.status === 403) {
                alert('У вас нет прав для просмотра материалов');
            }
            setMaterials([]);
        }
    };

    const columns = [
        { header: 'Название', accessor: item => item.title },
        { header: 'Описание', accessor: item => item.description },
        { header: 'Публичный', accessor: item => item.isPublic ? 'Да' : 'Нет' },
    ];

    return (
        <LoadingWrapper onLoad={loadMaterials} shouldLoad={!materials}>
            <div className={styles.container}>
                <h1 className={styles.title}>Мои материалы</h1>
                <Table columns={columns} data={materials || []} />
                {user?.role === 'teacher' && (
                    <button
                        className={styles.button}
                        onClick={() => navigate('/materials/new')}
                    >
                        Добавить материал
                    </button>
                )}
            </div>
        </LoadingWrapper>
    );
};

export default Materials;