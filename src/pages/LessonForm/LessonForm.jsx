import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { AuthContext } from '../../utils/AuthContext';
import { toast } from 'react-toastify';
import styles from './LessonForm.module.css';

const LessonForm = () => {
    const { lessonId } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const isEditMode = !!lessonId;

    const [formData, setFormData] = useState({
        name: '',
        date: '',
        duration: '',
        followedUserId: ''
    });

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStudents();
        if (isEditMode) {
            loadLesson();
        } else {
            setLoading(false);
        }
    }, [lessonId]);

    const loadStudents = async () => {
        try {
            const response = await axios.get('/teachers/students', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            setStudents(response.data.students || []);
        } catch (error) {
            console.error('Ошибка при загрузке учеников:', error);
            toast.error('Не удалось загрузить список учеников');
        }
    };

    const loadLesson = async () => {
        try {
            const response = await axios.get(`/lessons/${lessonId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            const lesson = response.data;
            setFormData({
                name: lesson.name,
                date: format(new Date(lesson.date), "yyyy-MM-dd'T'HH:mm"),
                duration: format(new Date(lesson.duration), "HH:mm"),
                followedUserId: lesson.studentIds[0] || ''
            });
        } catch (error) {
            console.error('Ошибка при загрузке урока:', error);
            toast.error('Не удалось загрузить данные урока');
            navigate('/lessons');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                ...formData,
                date: new Date(formData.date).toISOString(),
                duration: new Date(`1970-01-01T${formData.duration}`).toISOString()
            };

            if (isEditMode) {
                await axios.put(`/lessons/${lessonId}`, data, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });
                toast.success('Урок успешно обновлен');
            } else {
                await axios.post('/lessons', data, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });
                toast.success('Урок успешно создан');
            }
            navigate('/lessons');
        } catch (error) {
            console.error('Ошибка при сохранении урока:', error);
            toast.error(isEditMode ? 'Не удалось обновить урок' : 'Не удалось создать урок');
        }
    };

    if (loading) {
        return <div className={styles.loading}>Загрузка...</div>;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{isEditMode ? 'Редактирование урока' : 'Создание урока'}</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="name">Название</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="date">Дата и время</label>
                    <input
                        type="datetime-local"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="duration">Длительность</label>
                    <input
                        type="time"
                        id="duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="followedUserId">Ученик</label>
                    <select
                        id="followedUserId"
                        name="followedUserId"
                        value={formData.followedUserId}
                        onChange={handleChange}
                    >
                        <option value="">Выберите ученика</option>
                        {students.map(student => (
                            <option key={student.id} value={student.id}>
                                {student.firstName} {student.lastName}
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit" className={styles.submitButton}>
                    {isEditMode ? 'Обновить' : 'Создать'}
                </button>
            </form>
        </div>
    );
};

export default LessonForm; 