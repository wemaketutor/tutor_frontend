import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LessonsTeacher.module.css';

const MyLessons = () => {
    const navigate = useNavigate();

    const goPage = (name) => {
        navigate(`/${name}`);
    };

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

    const schedule = times.map((time, index) => ({
        time,
        slots: days.map((day, dayIndex) => {
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
            <h1 className={styles.title}>Мои занятия</h1>
            <section className={styles.profileSection}>
                <div className={styles.imageContainer}>
                    <img
                        className={styles.profileImage}
                        src="https://www.meme-arsenal.com/memes/06ddb418ee477809334760a3c8d9a0e1.jpg"
                        alt="Иванова Светлана Владимировна"
                        width="300px"
                    />
                </div>
                <div className={styles.infoContainer}>
                    <h2>Иванова Светлана Владимировна</h2>
                    <p className={styles.secondaryText}>Стаж: 52 года</p>
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
                            <th scope="col"></th>
                            {days.map((day, index) => (
                                <th key={index} scope="col">{day}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {schedule.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                <th className={styles.timeCell} scope="row">{row.time}</th>
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

export default MyLessons;