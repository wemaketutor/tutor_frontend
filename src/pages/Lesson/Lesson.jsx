import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Lesson.module.css';
import LoadingWrapper from '../../components/Loader/LoadingWrapper';
import { AuthContext } from '../../utils/AuthContext';

const Lesson = () => {
    const { lessonId } = useParams();
    const [lessons, setLessons] = useState(null);
    const [lesson, setLesson] = useState(null);
    const { user } = useContext(AuthContext);
    const role = user?.role;
    const isTeacher = role === 'teacher';
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

            setLessons(lessonList || []);
        } catch (error) {
            console.error('Ошибка при загрузке уроков:', error.response?.data || error.message);
            if (error.response?.status === 401) {
                alert('Пожалуйста, войдите в систему');
            }
            setLessons([]);
        }
    };

    useEffect(() => {
        if (lessons) {
            const foundLesson = lessons.find(l => l.id === Number(lessonId));
            setLesson(foundLesson || null);
        }
    }, [lessons, lessonId]);

    const deleteLesson = async () => {
        if (!window.confirm('Вы уверены, что хотите удалить этот урок?')) return;

        try {
            await axios.delete(`/lessons/${lessonId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            alert('Урок удалён');
            navigate('/lessons');
        } catch (error) {
            console.error('Ошибка при удалении:', error.response?.data || error.message);
            alert('Не удалось удалить урок.');
        }
    };

    return (
        <LoadingWrapper onLoad={loadLessons} shouldLoad={!lessons}>
            <div className={styles.container}>
                {lesson ? (
                    <>
                        <h1 className={styles.title}>{lesson.name}</h1>
                        <div className={styles.detail}>
                            <p><strong>Предмет:</strong> {lesson.subject}</p>
                            <p><strong>Дата начала:</strong> {new Date(lesson.startTime).toLocaleString()}</p>
                            <p><strong>Дата окончания:</strong> {new Date(lesson.endTime).toLocaleString()}</p>
                            <p><strong>Описание:</strong> {lesson.description || 'Нет описания'}</p>
                            <p><strong>Учитель:</strong> {lesson.teacherId}</p>
                            <p><strong>Учащиеся:</strong> {lesson.studentIds?.join(', ') || 'Нет'}</p>
                            <p className={styles.link} onClick={() => navigate(lesson.homeworkLink)}>Задание</p>
                        </div>

                        {isTeacher && (
                            <button 
                                type="button"
                                className={styles.deleteButton}
                                onClick={deleteLesson}
                            >
                                Удалить урок
                            </button>
                        )}
                    </>
                ) : (
                    <p>Урок не найден.</p>
                )}
            </div>
        </LoadingWrapper>
    );
};

export default Lesson;
