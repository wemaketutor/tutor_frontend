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
    const isStudent = role === 'student';
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
                navigate('/login');
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

    const takeLesson = async () => {
        if (!window.confirm('Вы уверены, что хотите записаться на этот урок?')) return;

        try {
            const token = localStorage.getItem('accessToken');
            await axios.post(
                `/lessons/${lessonId}/take`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    params: {
                        studentId: user.id
                    }
                }
            );
            alert('Вы успешно записались на урок');
            await loadLessons();
        } catch (error) {
            console.error('Ошибка при записи на урок:', error.response?.data || error.message);
            if (error.response?.status === 400) {
                alert('Урок не доступен для записи или вы уже записаны');
            } else if (error.response?.status === 401) {
                alert('Пожалуйста, войдите в систему');
                navigate('/login');
            } else if (error.response?.status === 404) {
                alert('Урок не найден');
            } else {
                alert('Не удалось записаться на урок');
            }
        }
    };

    const switchLesson = async () => {
        if (!window.confirm('Вы уверены, что хотите отправить запрос на обмен этим уроком?')) return;

        try {
            const token = localStorage.getItem('accessToken');
            const otherStudentId = lesson.studentIds[0]; // Предполагаем, что только один студент записан
            await axios.post(
                `/lessons/${lessonId}/switch`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    params: {
                        studentId: user.id,
                        otherStudentId: otherStudentId
                    }
                }
            );
            alert('Запрос на обмен уроком отправлен');
            await loadLessons();
        } catch (error) {
            console.error('Ошибка при запросе обмена:', error.response?.data || error.message);
            if (error.response?.status === 400) {
                alert('Условия для обмена не соблюдены');
            } else if (error.response?.status === 401) {
                alert('Пожалуйста, войдите в систему');
                navigate('/login');
            } else if (error.response?.status === 404) {
                alert('Урок или студент не найдены');
            } else {
                alert('Не удалось отправить запрос на обмен');
            }
        }
    };

    const approveSwitchLesson = async (approve) => {
        const action = approve ? 'принять' : 'отклонить';
        if (!window.confirm(`Вы уверены, что хотите ${action} запрос на обмен уроком?`)) return;

        try {
            const token = localStorage.getItem('accessToken');
            await axios.post(
                `/lessons/${lessonId}/approve-switch`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    params: {
                        studentId: user.id,
                        approve: approve
                    }
                }
            );
            alert(`Запрос на обмен ${approve ? 'принят' : 'отклонён'}`);
            await loadLessons();
        } catch (error) {
            console.error('Ошибка при обработке запроса обмена:', error.response?.data || error.message);
            if (error.response?.status === 400) {
                alert('Ошибка при обработке запроса');
            } else if (error.response?.status === 401) {
                alert('Пожалуйста, войдите в систему');
                navigate('/login');
            } else if (error.response?.status === 404) {
                alert('Урок или студент не найдены');
            } else {
                alert(`Не удалось ${action} запрос на обмен`);
            }
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

                        <div className={styles.buttonContainer}>
                            {isTeacher && (
                                <button
                                    type="button"
                                    className={styles.deleteButton}
                                    onClick={deleteLesson}
                                >
                                    Удалить урок
                                </button>
                            )}
                            {isStudent && !lesson.studentIds?.includes(user.id) && (
                                <button
                                    type="button"
                                    className={styles.button}
                                    onClick={takeLesson}
                                >
                                    Записаться на урок
                                </button>
                            )}
                            {isStudent && lesson.studentIds?.includes(user.id) && lesson.studentIds?.length === 1 && (
                                <button
                                    type="button"
                                    className={styles.button}
                                    onClick={switchLesson}
                                >
                                    Поменяться уроком
                                </button>
                            )}
                            {isStudent && lesson.studentIds?.includes(user.id) && (
                                <>
                                    <button
                                        type="button"
                                        className={styles.button}
                                        onClick={() => approveSwitchLesson(true)}
                                    >
                                        Принять обмен
                                    </button>
                                    <button
                                        type="button"
                                        className={styles.button}
                                        onClick={() => approveSwitchLesson(false)}
                                    >
                                        Отклонить обмен
                                    </button>
                                </>
                            )}
                        </div>
                    </>
                ) : (
                    <p>Урок не найден.</p>
                )}
            </div>
        </LoadingWrapper>
    );
};

export default Lesson;