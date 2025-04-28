import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Material.module.css';
import LoadingWrapper from '../../components/Loader/LoadingWrapper';
import { AuthContext } from '../../utils/AuthContext';

const Material = () => {
    const { materialId } = useParams();
    const [materials, setMaterials] = useState(null);
    const [material, setMaterial] = useState(null);
    const { user } = useContext(AuthContext);
    const isTeacher = user?.role === 'teacher';
    const navigate = useNavigate();

    const loadMaterials = async () => {
        try {
            if (!user) {
                alert('Пожалуйста, войдите в систему');
                navigate('/login');
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
            setMaterials(materialList);
        } catch (error) {
            console.error('Ошибка при загрузке материалов:', error.response?.data || error.message);
            if (error.response?.status === 401) {
                alert('Пожалуйста, войдите в систему');
                navigate('/login');
            } else if (error.response?.status === 403) {
                alert('У вас нет прав для просмотра материалов');
            }
            setMaterials([]);
        }
    };

    useEffect(() => {
        if (materials) {
            const foundMaterial = materials.find(m => m.id === Number(materialId));
            setMaterial(foundMaterial || null);
        }
    }, [materials, materialId]);

    const deleteMaterial = async () => {
        if (!window.confirm('Вы уверены, что хотите удалить этот материал?')) return;

        try {
            await axios.delete(`/materials/${materialId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            alert('Материал удалён');
            navigate('/materials');
        } catch (error) {
            console.error('Ошибка при удалении:', error.response?.data || error.message);
            alert('Не удалось удалить материал.');
        }
    };

    return (
        <LoadingWrapper onLoad={loadMaterials} shouldLoad={!materials}>
            <div className={styles.container}>
                {material ? (
                    <>
                        <h1 className={styles.title}>{material.title}</h1>
                        <div className={styles.detail}>
                            <p><strong>Описание:</strong> {material.description || 'Нет описания'}</p>
                            <p><strong>Публичный:</strong> {material.isPublic ? 'Да' : 'Нет'}</p>
                            <p><strong>Учитель:</strong> {material.teacherId}</p>
                            <p><strong>Учащиеся:</strong> {material.studentIds?.length > 0 ? material.studentIds.join(', ') : 'Нет'}</p>
                            <p>
                                <strong>Файл:</strong>{' '}
                                <a
                                    href={material.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.link}
                                >
                                    Скачать
                                </a>
                            </p>
                        </div>

                        {isTeacher && (
                            <button
                                type="button"
                                className={styles.deleteButton}
                                onClick={deleteMaterial}
                            >
                                Удалить материал
                            </button>
                        )}
                    </>
                ) : (
                    <p>Материал не найден.</p>
                )}
            </div>
        </LoadingWrapper>
    );
};

export default Material;    