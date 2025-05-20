import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './Material.module.css';
import LoadingWrapper from '../../components/Loader/LoadingWrapper';
import { AuthContext } from '../../utils/AuthContext';
import { toast } from 'react-toastify';
import { materialsAPI } from '../../services/api';
import api from '../../utils/axios';

const Material = () => {
    const { materialId } = useParams();
    const [materials, setMaterials] = useState(null);
    const [material, setMaterial] = useState(null);
    const [isDownloading, setIsDownloading] = useState(false);
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

            const response = await api.get('/materials', { params });

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
            await api.delete(`/materials/${materialId}`);
            toast.success('Материал удалён');
            navigate('/materials');
        } catch (error) {
            console.error('Ошибка при удалении:', error.response?.data || error.message);
            toast.error('Не удалось удалить материал.');
        }
    };
    
    const downloadFile = async () => {
        if (!material || !material.fileUrl) return;
        
        setIsDownloading(true);
        try {
            const response = await materialsAPI.downloadFile(material.id);
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            
            const fileName = `${material.title.replace(/[^a-zа-яё0-9]/gi, '_')}.pdf`;
            link.setAttribute('download', fileName);
            
            document.body.appendChild(link);
            link.click();
            
            link.remove();
            window.URL.revokeObjectURL(url);
            
            toast.success('Файл успешно скачан');
        } catch (error) {
            console.error('Ошибка при скачивании файла:', error);
            
            if (error.response) {
                if (error.response.status === 404) {
                    toast.error('Файл не найден на сервере');
                } else {
                    toast.error(`Ошибка сервера: ${error.response.status}`);
                }
            } else if (error.request) {
                toast.error('Сервер не отвечает. Проверьте подключение');
            } else {
                toast.error('Не удалось скачать файл');
            }
        } finally {
            setIsDownloading(false);
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
                                {material.fileUrl ? (
                                    <button
                                        onClick={downloadFile}
                                        className={styles.link}
                                        disabled={isDownloading}
                                    >
                                        {isDownloading ? 'Скачивание...' : 'Скачать'}
                                    </button>
                                ) : (
                                    <span>Файл не прикреплен</span>
                                )}
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