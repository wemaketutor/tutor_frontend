import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { AuthContext } from '../../utils/AuthContext';
import { toast } from 'react-toastify';
import styles from './LessonDetails.module.css';

const LessonDetails = () => {
    const { lessonId } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const role = user?.role;
    const isTeacher = role === 'teacher';

    const [lesson, setLesson] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLesson();
    }, [lessonId]);

    const loadLesson = async () => {
        try {
            const response = await axios.get(`/lessons/${lessonId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            setLesson(response.data);
            if (response.data.studentIds?.length > 0) {
                loadStudents(response.data.studentIds);
            } else {
                setLoading(false);
            }
        } catch (error) {
            console.error('Ошибка при загрузке урока:', error);
            if (error.response?.status === 401) {
                toast.error('Пожалуйста, войдите в систему');
                navigate('/login');
            } else {
                toast.error('Не удалось загрузить урок');
            }
            setLoading(false);
        }
    };

    const loadStudents = async (studentIds) => {
        try {
            const response = await axios.get('/teachers/students', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            const allStudents = response.data.students || [];
            const filteredStudents = allStudents.filter(student => 
                studentIds.includes(student.id)
            );
            setStudents(filteredStudents);
        } catch (error) {
            console.error('Ошибка при загрузке учеников:', error);
            toast.error('Не удалось загрузить список учеников');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Вы уверены, что хотите удалить этот урок?')) {
            return;
        }

        try {
            await axios.delete(`/lessons/${lessonId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            toast.success('Урок успешно удален');
            navigate('/lessons');
        } catch (error) {
            console.error('Ошибка при удалении урока:', error);
            toast.error('Не удалось удалить урок');
        }
    };

    if (loading) {
        return <div className={styles.loading}>Загрузка...</div>;
    }

    if (!lesson) {
        return <div className={styles.error}>Урок не найден</div>;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{lesson.name}</h1>
            
            <div className={styles.details}>
                <div className={styles.detailItem}>
                    <span className={styles.label}>Дата:</span>
                    <span className={styles.value}>
                        {format(new Date(lesson.date), 'd MMMM yyyy, HH:mm', { locale: ru })}
                    </span>
                </div>

                <div className={styles.detailItem}>
                    <span className={styles.label}>Длительность:</span>
                    <span className={styles.value}>
                        {format(new Date(lesson.duration), 'HH:mm')}
                    </span>
                </div>

                {students.length > 0 && (
                    <div className={styles.detailItem}>
                        <span className={styles.label}>Ученики:</span>
                        <div className={styles.students}>
                            {students.map(student => (
                                <div key={student.id} className={styles.student}>
                                    {student.firstName} {student.lastName}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className={styles.actions}>
                {isTeacher && (
                    <>
                        <button
                            onClick={() => navigate(`/lessons/${lessonId}/edit`)}
                            className={styles.editButton}
                        >
                            Редактировать
                        </button>
                        <button
                            onClick={handleDelete}
                            className={styles.deleteButton}
                        >
                            Удалить
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default LessonDetails; 