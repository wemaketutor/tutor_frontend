import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Teacher.module.css';

const TeacherLessonsCalendar = ({ lessons }) => {
    const [currentWeekStart, setCurrentWeekStart] = useState(() => {
        // Initialize to the start of the current week (Monday)
        const today = new Date();
        const dayOfWeek = today.getDay();
        const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust to Monday
        const monday = new Date(today);
        monday.setDate(today.getDate() + diff);
        monday.setHours(0, 0, 0, 0);
        return monday;
    });

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

    // Parse time slots into Date objects for comparison
    const timeSlots = times.map((time) => {
        const [start, end] = time.split('-');
        const [startHour, startMinute] = start.split(':').map(Number);
        const [endHour, endMinute] = end.split(':').map(Number);
        return { time, startHour, startMinute, endHour, endMinute };
    });

    // Generate dates for the current week
    const weekDates = days.map((_, index) => {
        const date = new Date(currentWeekStart);
        date.setDate(currentWeekStart.getDate() + index);
        return date;
    });

    // Function to check if a lesson falls within a time slot on a specific date
    const isLessonInSlot = (lesson, slot, dayDate) => {
        const lessonStart = new Date(lesson.startTime);
        const lessonEnd = new Date(lesson.endTime);

        // Check if the lesson is on the same day
        const isSameDay =
            lessonStart.getFullYear() === dayDate.getFullYear() &&
            lessonStart.getMonth() === dayDate.getMonth() &&
            lessonStart.getDate() === dayDate.getDate();

        if (!isSameDay) return false;

        // Create start and end times for the slot on the given date
        const slotStart = new Date(dayDate);
        slotStart.setHours(slot.startHour, slot.startMinute, 0, 0);

        const slotEnd = new Date(dayDate);
        slotEnd.setHours(slot.endHour, slot.endMinute, 0, 0);

        // Check if lesson overlaps with the slot (inclusive)
        return lessonStart <= slotEnd && lessonEnd >= slotStart;
    };

    // Map lessons to their corresponding slots
    const schedule = timeSlots.map((slot) => ({
        time: slot.time,
        slots: weekDates.map((dayDate) => {
            const matchingLesson = lessons.find((lesson) =>
                isLessonInSlot(lesson, slot, dayDate)
            );
            if (matchingLesson) {
                return {
                    status: 'available',
                    text: 'Открыть',
                    link: `/lesson/${matchingLesson.id}`
                };
            }
            return {
                status: 'unavailable',
                text: 'Нет урока'
            };
        })
    }));

    // Navigation handlers
    const goToPreviousWeek = () => {
        const newStart = new Date(currentWeekStart);
        newStart.setDate(currentWeekStart.getDate() - 7);
        setCurrentWeekStart(newStart);
    };

    const goToNextWeek = () => {
        const newStart = new Date(currentWeekStart);
        newStart.setDate(currentWeekStart.getDate() + 7);
        setCurrentWeekStart(newStart);
    };

    return (
        <section className={styles.tableSection}>
            <div className={styles.navigation}>
                <button onClick={goToPreviousWeek} className={styles.button}>
                    &larr; Предыдущая неделя
                </button>
                <button onClick={goToNextWeek} className={styles.button}>
                    Следующая неделя &rarr;
                </button>
            </div>
            {schedule.length === 0 ? (
                <p className={styles.secondaryText}>Уроки не найдены</p>
            ) : (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th></th>
                            {weekDates.map((date, index) => (
                                <th key={index}>
                                    {days[index]}<br />
                                    {date.toLocaleDateString('ru-RU')}
                                </th>
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
                                            slot.status === 'available'
                                                ? styles.available
                                                : styles.unavailable
                                        }`}
                                    >
                                        {slot.status === 'available' ? (
                                            <Link to={slot.link} className={styles.link}>
                                                {slot.text}
                                            </Link>
                                        ) : (
                                            <span className={styles.secondaryText}>
                                                {slot.text}
                                            </span>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </section>
    );
};

export default TeacherLessonsCalendar;