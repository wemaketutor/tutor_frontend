import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../utils/AuthContext';
import LoadingWrapper from '../../components/Loader/LoadingWrapper';
import styles from './NewHomework.module.css';

const NewHomework = () => {
  const { user, checkAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [homework, setHomework] = useState({
    title: '',
    description: '',
    dueDate: '',
    studentId: '',
    lessonId: '',
    status: 'not_done',
    assessmentScale: 10,
  });
  const [students, setStudents] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [isChanged, setIsChanged] = useState(false);

  const isTeacher = user?.role === 'teacher';

  const loadData = async () => {
    try {
      const result = await checkAuth();
      if (!result) {
        navigate('/login', { replace: true });
        return;
      }
      if (!isTeacher) {
        alert('Только учителя могут создавать домашние задания');
        navigate('/homeworks', { replace: true });
        return;
      }

      const token = localStorage.getItem('accessToken');

      // Загрузка списка студентов
      const studentsResponse = await axios.get('/teacher/students', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(studentsResponse.data.students || []);

      // Загрузка списка уроков учителя
      const lessonsResponse = await axios.get('/lessons', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: 1,
          per_page: 100,
          sort_by: 'date_created',
          sort_order: 'desc',
        },
      });
      setLessons(lessonsResponse.data.ownerLessons || []);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error.response?.data || error.message);
      navigate('/login', { replace: true });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHomework((prev) => ({
      ...prev,
      [name]: value,
    }));
    setIsChanged(true);
  };

  const createHomework = async (e) => {
    e.preventDefault();
    try {
      // Валидация на клиенте
      if (!homework.title || !homework.description || !homework.dueDate || !homework.studentId || !homework.lessonId) {
        alert('Заполните все обязательные поля');
        return;
      }

      const token = localStorage.getItem('accessToken');
      const payload = {
        ...homework,
        studentId: parseInt(homework.studentId),
        lessonId: parseInt(homework.lessonId),
        assessmentScale: parseInt(homework.assessmentScale),
      };

      await axios.post('/homeworks', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Домашнее задание создано');
      navigate('/homeworks', { replace: true });
    } catch (error) {
      console.error('Ошибка при создании:', error.response?.data || error.message);
      if (error.response?.status === 422) {
        alert(`Ошибка валидации: ${error.response.data.detail}`);
      } else if (error.response?.status === 403) {
        alert('У вас нет прав для создания задания');
      } else {
        alert('Не удалось создать задание');
      }
    }
  };

  return (
    <LoadingWrapper onLoad={loadData} shouldLoad={!students.length && !lessons.length && isTeacher}>
      <form className={styles.container} onSubmit={createHomework}>
        <h2 className={styles.title}>Создание нового домашнего задания</h2>

        <div className={styles.formGroup}>
          <label className={styles.label}>Название:</label>
          <input
            type="text"
            name="title"
            value={homework.title}
            className={styles.input}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Описание:</label>
          <textarea
            name="description"
            className={styles.textarea}
            rows={5}
            value={homework.description}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Срок сдачи:</label>
          <input
            type="date"
            name="dueDate"
            value={homework.dueDate}
            className={styles.input}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Ученик:</label>
          <select
            name="studentId"
            className={styles.select}
            value={homework.studentId}
            onChange={handleInputChange}
            required
          >
            <option value="">Выберите ученика</option>
            {students.map((student) => (
              <option key={student.studentId} value={student.user.id}>
                {student.user.firstName} {student.user.lastName} ({student.user.email})
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Урок:</label>
          <select
            name="lessonId"
            className={styles.select}
            value={homework.lessonId}
            onChange={handleInputChange}
            required
          >
            <option value="">Выберите урок</option>
            {lessons.map((lesson) => (
              <option key={lesson.id} value={lesson.id}>
                {lesson.name} ({new Date(lesson.startTime).toLocaleDateString()})
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Вес оценки:</label>
          <input
            type="number"
            name="assessmentScale"
            value={homework.assessmentScale}
            className={styles.input}
            onChange={handleInputChange}
            min="1"
            required
          />
        </div>

        <button type="submit" className={styles.button} disabled={!isChanged}>
          Создать задание
        </button>
      </form>
    </LoadingWrapper>
  );
};

export default NewHomework;