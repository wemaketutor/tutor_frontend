import React from 'react';
import styles from '../Teacher/Teacher.module.css';
import Table from '../../components/Table/Table';

const TeacherLessonsTable = ({ lessons }) => {
    const columns = [
        {
            header: 'Название',
            accessor: (item) => item.name
        },
        {
            header: 'Дата',
            accessor: (item) => new Date(item.startTime).toLocaleDateString('ru-RU')
        },
        {
            header: 'Время начала',
            accessor: (item) =>
                new Date(item.startTime).toLocaleTimeString('ru-RU', {
                    hour: '2-digit',
                    minute: '2-digit'
                })
        },
        {
            header: 'Время окончания',
            accessor: (item) =>
                new Date(item.endTime).toLocaleTimeString('ru-RU', {
                    hour: '2-digit',
                    minute: '2-digit'
                })
        }
    ];

    const data = Array.isArray(lessons)
        ? lessons.map((lesson) => ({
              id: lesson.id,
              name: lesson.name,
              startTime: lesson.startTime,
              endTime: lesson.endTime,
              studentIds: lesson.studentIds,
              link: `/lesson/${lesson.id}`
          }))
        : [];

    return (
        <section className={styles.tableSection}>
            {lessons.length === 0 ? (
                <p className={styles.secondaryText}>Уроки не найдены</p>
            ) : (
                <Table columns={columns} data={data} />
            )}
        </section>
    );
};

export default TeacherLessonsTable;