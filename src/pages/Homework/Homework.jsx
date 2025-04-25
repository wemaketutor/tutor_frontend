import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../utils/AuthContext';
import LoadingWrapper from '../../components/Loader/LoadingWrapper';
import styles from './Homework.module.css';

const Homework = () => {
  const { user, checkAuth } = useContext(AuthContext);
  const { homeworkId } = useParams();
  const navigate = useNavigate();
  const [homework, setHomework] = useState(null);
  const [isChanged, setIsChanged] = useState(false);

  const isTeacher = user?.role === 'teacher';

  const loadHomework = async () => {
    try {
      const result = await checkAuth();
      if (!result) {
        navigate('/login', { replace: true });
      } else {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`/homeworks/${homeworkId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHomework(response.data);
      }
    } catch (error) {
      console.error('Ошибка загрузки:', error);
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

  const updateHomework = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('accessToken');
      await axios.put(`/homeworks/${homeworkId}`, homework, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Домашнее задание обновлено');
      setIsChanged(false);
    } catch (error) {
      console.error('Ошибка при обновлении:', error);
      alert('Не удалось обновить');
    }
  };

  const deleteHomework = async () => {
    if (!window.confirm('Удалить это задание?')) return;
    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`/homeworks/${homeworkId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/homeworks', { replace: true });
    } catch (error) {
      console.error('Ошибка при удалении:', error);
      alert('Не удалось удалить');
    }
  };

  return (
    <LoadingWrapper onLoad={loadHomework} shouldLoad={!homework}>
      <form className={styles.container} onSubmit={updateHomework}>
        <h2 className={styles.title}>Домашнее задание</h2>

        <div className={styles.formGroup}>
          <label className={styles.label}>Название:</label>
          <input
            type="text"
            name="title"
            value={homework?.title || ''}
            className={styles.input}
            onChange={handleInputChange}
            disabled={!isTeacher}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Описание:</label>
          <textarea
            name="description"
            className={styles.textarea}
            rows={5}
            value={homework?.description || ''}
            onChange={handleInputChange}
            disabled={!isTeacher}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Класс:</label>
          <input
            type="text"
            name="grade"
            value={homework?.grade || ''}
            className={styles.input}
            onChange={handleInputChange}
            disabled={!isTeacher}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Срок сдачи:</label>
          <input
            type="date"
            name="dueDate"
            value={homework?.dueDate?.substring(0, 10) || ''}
            className={styles.input}
            onChange={handleInputChange}
            disabled={!isTeacher}
          />
        </div>

        {isTeacher && (
          <>
            <button type="submit" className={styles.button} disabled={!isChanged}>
              Обновить
            </button>
            <button type="button" className={styles.deleteButton} onClick={deleteHomework}>
              Удалить
            </button>
          </>
        )}
      </form>
    </LoadingWrapper>
  );
};

export default Homework;
