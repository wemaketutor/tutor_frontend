import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../utils/AuthContext';
import LoadingWrapper from '../../components/Loader/LoadingWrapper';
import styles from './NewLesson.module.css';

const NewLesson = () => {
  const { user, checkAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [lesson, setLesson] = useState({
    name: '',
    description: '',
    subject: '',
    date: '',
    duration: '',
    followedUserId: '',
    homeworkLink: '',
  });
  const [students, setStudents] = useState([]);
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
        alert('Только учителя могут создавать уроки');
        navigate('/lessons', { replace: true });
        return;
      }

      // Загрузка списка студентов
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('/teacher/students', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(response.data.students || []);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error.response?.data || error.message);
      navigate('/login', { replace: true });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLesson((prev) => ({
      ...prev,
      [name]: value,
    }));
    setIsChanged(true);
  };

  const createLesson = async (e) => {
    e.preventDefault();
    try {
      // Валидация на клиенте
      if (!lesson.name || !lesson.date) {
        alert('Заполните обязательные поля: название и дата');
        return;
      }
      const dateWithOffset = lesson.date + ':00+03:00'
      const durationDate = new Date(dateWithOffset);
      const durationISO = lesson.duration 
        ? lesson.duration 
        : new Date(durationDate.getTime() + 60 * 60 * 1000).toISOString();
      const token = localStorage.getItem('accessToken');
      const payload = {
        name: lesson.name,
        date: dateWithOffset,
        duration: durationISO + ':00+03:00',
        followedUserId: lesson.followedUserId ? parseInt(lesson.followedUserId) : undefined,
      };

      await axios.post('/lessons', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Урок создан');
      navigate('/lessons', { replace: true });
    } catch (error) {
      console.error('Ошибка при создании:', error.response?.data || error.message);
      if (error.response?.status === 422) {
        alert(`Ошибка валидации: ${error.response.data.detail}`);
      } else if (error.response?.status === 403) {
        alert('У вас нет прав для создания урока');
      } else if (error.response?.status === 404) {
        alert('Указанный ученик не найден');
      } else {
        alert('Не удалось создать урок');
      }
    }
  };

  return (
    <LoadingWrapper onLoad={loadData} shouldLoad={!students.length && isTeacher}>
      <form className={styles.container} onSubmit={createLesson}>
        <h2 className={styles.title}>Создание нового урока</h2>

        <div className={styles.formGroup}>
          <label className={styles.label}>Название:</label>
          <input
            type="text"
            name="name"
            value={lesson.name}
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
            value={lesson.description}
            onChange={handleInputChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Предмет:</label>
          <input
            type="text"
            name="subject"
            value={lesson.subject}
            className={styles.input}
            onChange={handleInputChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Дата и время начала:</label>
          <input
            type="datetime-local"
            name="date"
            value={lesson.date}
            className={styles.input}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Дата и время окончания:</label>
          <input
            type="datetime-local"
            name="duration"
            value={lesson.duration}
            className={styles.input}
            onChange={handleInputChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Ученик:</label>
          <select
            name="followedUserId"
            className={styles.select}
            value={lesson.followedUserId}
            onChange={handleInputChange}
          >
            <option value="">Без ученика</option>
            {students.map((student) => (
              <option key={student.studentId} value={student.user.id}>
                {student.user.firstName} {student.user.lastName} ({student.user.email})
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Ссылка на задание:</label>
          <input
            type="url"
            name="homeworkLink"
            value={lesson.homeworkLink}
            className={styles.input}
            onChange={handleInputChange}
          />
        </div>

        <button type="submit" className={styles.button} disabled={!isChanged}>
          Создать урок
        </button>
      </form>
    </LoadingWrapper>
  );
};

export default NewLesson;