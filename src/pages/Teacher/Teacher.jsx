import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './Teacher.module.css';
import axios from 'axios';

const Teacher = () => {
    const { id } = useParams();
    const [teacher, setTeacher] = useState(null);

    useEffect(() => {
        const fetchTeacher = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/teachers/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });
                setTeacher(response.data);
            } catch (error) {
                console.error('Ошибка загрузки данных учителя:', error.response ? error.response.data : error.message);
            }
        };

        fetchTeacher();
    }, [id]);

    if (!teacher) {
        return <p className={styles.loading}>Загрузка...</p>;
    }

    const times = [
        '8:00-9:30',
        '9:45-11:15',
        '11:30-13:00',
        '13:15-14:45',
        '15:00-16:30',
        '16:45-18:15',
        '18:30-20:00',
        '20:15-21:45'
    ];

    const days = [
        'Понедельник',
        'Вторник',
        'Среда',
        'Четверг',
        'Пятница',
        'Суббота',
        'Воскресенье'
    ];

    const schedule = times.map((time) => ({
        time,
        slots: days.map((day) => {
            if (day === 'Воскресенье') {
                return { status: 'unavailable', text: 'Нет занятий' };
            }
            if (day === 'Суббота' && time === '20:15-21:45') {
                return { status: 'booked', text: 'Мест нет' };
            }
            return { status: 'available', text: 'Записаться', link: '' };
        })
    }));

    return (
        <>
            <h1 className={styles.title}>Репетитор</h1>
            <section className={styles.profileSection}>
                <div className={styles.imageContainer}>
                    <img
                        className={styles.profileImage}
                        src="https://www.meme-arsenal.com/memes/06ddb418ee477809334760a3c8d9a0e1.jpg"
                        alt={`${teacher.firstName} ${teacher.lastName}`}
                        width="300px"
                    />
                </div>
                <div className={styles.infoContainer}>
                    <h2>{teacher.firstName} {teacher.lastName}</h2>
                    <p className={styles.secondaryText}>ID: {teacher.id}</p>
                    <p className={styles.secondaryText}>Email: {teacher.email}</p>
                    <div className={styles.subjectsContainer}>
                        <p className={styles.secondaryText}>Предметы:</p>
                        <ul className={styles.subjectsList}>
                            <li className={styles.subjectItem}>математический анализ</li>
                            <li className={styles.subjectItem}>аналитическая геометрия</li>
                            <li className={styles.subjectItem}>математическая логика</li>
                        </ul>
                    </div>
                </div>
            </section>

            <h2 className={styles.subtitle}>Свободные ячейки</h2>
            <section className={styles.tableSection}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th></th>
                            {days.map((day, index) => (
                                <th key={index}>{day}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {schedule.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                <th className={styles.timeCell}>{row.time}</th>
                                {row.slots.map((slot, slotIndex) => (
                                    <td
                                        key={slotIndex}
                                        className={`${styles.tableCell} ${
                                            slot.status === 'available' ? styles.available :
                                            slot.status === 'booked' ? styles.booked :
                                            styles.unavailable
                                        }`}
                                    >
                                        {slot.status === 'available' ? (
                                            <a href={slot.link} className={styles.link}>{slot.text}</a>
                                        ) : (
                                            <span className={styles.secondaryText}>{slot.text}</span>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </>
    );
};

export default Teacher;
