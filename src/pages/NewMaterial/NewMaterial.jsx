import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../utils/AuthContext';
import LoadingWrapper from '../../components/Loader/LoadingWrapper';
import styles from './NewMaterial.module.css';

const NewMaterial = () => {
  const { user, checkAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [material, setMaterial] = useState({
    title: '',
    description: '',
    fileUrl: '',
    isPublic: true,
    studentIds: [],
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
        alert('Только учителя могут создавать материалы');
        navigate('/resources', { replace: true });
        return;
      }

      // Загрузка списка студентов для учителя
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('/teacher/students', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(response.data.students || []);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      navigate('/login', { replace: true });
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMaterial((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setIsChanged(true);
  };

  const handleStudentChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map((option) => parseInt(option.value));
    setMaterial((prev) => ({
      ...prev,
      studentIds: selectedOptions,
    }));
    setIsChanged(true);
  };

  const createMaterial = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('accessToken');
      await axios.post('/materials', material, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Материал создан');
      navigate('/resources', { replace: true });
    } catch (error) {
      console.error('Ошибка при создании:', error.response?.data || error.message);
      alert('Не удалось создать материал');
    }
  };

  return (
    <LoadingWrapper onLoad={loadData} shouldLoad={!students.length && isTeacher}>
      <form className={styles.container} onSubmit={createMaterial}>
        <h2 className={styles.title}>Создание нового материала</h2>

        <div className={styles.formGroup}>
          <label className={styles.label}>Название:</label>
          <input
            type="text"
            name="title"
            value={material.title}
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
            value={material.description}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>URL файла:</label>
          <input
            type="url"
            name="fileUrl"
            value={material.fileUrl}
            className={styles.input}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            <input
              type="checkbox"
              name="isPublic"
              checked={material.isPublic}
              onChange={handleInputChange}
            />
            Публичный материал
          </label>
        </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Учащиеся:</label>
            <select
              multiple
              name="studentIds"
              className={styles.select}
              value={material.studentIds}
              onChange={handleStudentChange}
            >
              {students.map((student) => (
                <option key={student.studentId} value={student.user.id}>
                  {student.user.firstName} {student.user.lastName} ({student.user.email})
                </option>
              ))}
            </select>
          </div>
          
        <button type="submit" className={styles.button} disabled={!isChanged}>
          Создать материал
        </button>
      </form>
    </LoadingWrapper>
  );
};

export default NewMaterial;