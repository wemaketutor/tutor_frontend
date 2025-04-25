import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../utils/AuthContext.jsx';
import axios from 'axios';
import LoadingWrapper from '../../components/Loader/LoadingWrapper';
import styles from './Profile.module.css';

const Profile = () => {
  const { user, logout, checkAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState(user || null);
  const [isChanged, setIsChanged] = useState(false);

  const loadProfile = async () => {
    try {
      const result = await checkAuth();
      if (!result) {
        navigate('/login', { replace: true });
      } else {
        setFormData(user);
      }
    } catch (error) {
      navigate('/login', { replace: true });
    }
  };

  useEffect(() => {
    if (formData && user) {
      const isSame = JSON.stringify(formData) === JSON.stringify(user);
      setIsChanged(!isSame);
    }
  }, [formData, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.put(`/profile/${formData.email}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Профиль обновлён');
      setFormData(response.data);
    } catch (error) {
      console.error('Ошибка при обновлении профиля:', error);
      alert('Не удалось обновить профиль');
    }
  };

  const deleteAccount = async () => {
    if (!window.confirm('Вы уверены, что хотите удалить аккаунт?')) return;
    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`/profile/${formData.email}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await logout();
      navigate('/home', { replace: true });
    } catch (error) {
      console.error('Ошибка при удалении аккаунта:', error);
      alert('Не удалось удалить аккаунт');
    }
  };

  return (
    <LoadingWrapper onLoad={loadProfile} shouldLoad={!user}>
      <form className={styles.container} onSubmit={updateProfile}>
        <h2 className={styles.title}>Мой аккаунт</h2>
        <div className={styles.formGroup}>
          <label htmlFor="id" className={styles.label}>ID:</label>
          <input
            type="text"
            id="id"
            name="id"
            className={styles.input}
            value={formData?.id || ''}
            disabled
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            className={styles.input}
            value={formData?.email || ''}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="username" className={styles.label}>Имя пользователя:</label>
          <input
            type="text"
            id="username"
            name="username"
            className={styles.input}
            value={formData?.username || ''}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="firstName" className={styles.label}>Имя:</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            className={styles.input}
            value={formData?.firstName || ''}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="lastName" className={styles.label}>Фамилия:</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            className={styles.input}
            value={formData?.lastName || ''}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>Пароль:</label>
          <input
            type="password"
            id="password"
            name="password"
            className={styles.input}
            value={formData?.password || ''}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="phone" className={styles.label}>Телефон:</label>
          <input
            type="text"
            id="phone"
            name="phone"
            className={styles.input}
            value={formData?.phone || ''}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="role" className={styles.label}>Роль:</label>
          <select
            id="role"
            name="role"
            className={styles.select}
            value={formData?.role || ''}
            onChange={handleInputChange}
          >
            <option value="student">Ученик</option>
            <option value="teacher">Преподаватель</option>
          </select>
        </div>
        <button type="submit" className={styles.button} disabled={!isChanged}>
          Обновить профиль
        </button>
        <button
          type="button"
          className={styles.button}
          onClick={async () => {
            await logout();
            navigate('/home', { replace: true });
          }}
        >
          Выйти
        </button>
        <button type="button" className={styles.deleteButton} onClick={deleteAccount}>
          Удалить аккаунт
        </button>
      </form>
    </LoadingWrapper>
  );
};

export default Profile;