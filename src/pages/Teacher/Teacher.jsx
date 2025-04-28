import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './Teacher.module.css';
import axios from 'axios';
import LoadingWrapper from '../../components/Loader/LoadingWrapper';
import TeacherLessonsTable from './TeacherLessonsTable';
import TeacherLessonsCalendar from './TeacherLessonsCalendar';

const Teacher = () => {
    const { id } = useParams();
    const [teacher, setTeacher] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            const [teacherResponse, lessonsResponse] = await Promise.all([
                axios.get(`/teachers/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    }
                }),
                axios.get(`/teacher/${id}/lessons/`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    }
                })
            ]);

            setTeacher(teacherResponse.data);
            setLessons(Array.isArray(lessonsResponse.data) ? lessonsResponse.data : []);
            setIsLoaded(true);
        } catch (error) {
            console.error('Ошибка загрузки данных:', error.response ? error.response.data : error.message);
            setError(error.response ? error.response.data.message : 'Ошибка загрузки данных');
            setIsLoaded(true);
        }
    };

    return (
        <LoadingWrapper onLoad={fetchData} shouldLoad={!isLoaded} noContainerStyles={true}>
            <div className={styles.container}>
                {error ? (
                    <p className={styles.secondaryText}>{error}</p>
                ) : (
                    <>
                        <h1 className={styles.title}>Преподаватель</h1>
                        <section className={styles.profileSection}>
                            <div className={styles.imageContainer}>
                                <img
                                    className={styles.profileImage}
                                    src="/src/assets/teacher-background-cropped.jpg"
                                    alt={`${teacher?.firstName} ${teacher?.lastName}`}
                                    width="300px"
                                />
                            </div>
                            <div className={styles.infoContainer}>
                                <h2>{teacher?.firstName} {teacher?.lastName}</h2>
                                <p className={styles.secondaryText}>ID: {teacher?.id}</p>
                                <p className={styles.secondaryText}>Email: {teacher?.email}</p>
                            </div>
                        </section>

                        <h2 className={styles.subtitle}>Расписание преподавателя</h2>
                        {/* <TeacherLessonsTable lessons={lessons} /> */}
                        <TeacherLessonsCalendar lessons={lessons} />
                    </>
                )}
            </div>
        </LoadingWrapper>
    );
};

export default Teacher;