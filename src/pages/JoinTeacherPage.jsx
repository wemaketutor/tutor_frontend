import React, { useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../utils/AuthContext';
import { toast } from 'react-toastify';

const JoinTeacherPage = () => {
  const { teacherId } = useParams();
  const { user, checkAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const joinTeacher = async () => {
      const isAuth = await checkAuth();
      if (!isAuth) {
        localStorage.setItem('redirectAfterLogin', window.location.pathname);
        navigate('/login');
        return;
      }

      if (!user || user.role !== 'student') {
        toast.error('Только студенты могут присоединяться к учителю');
        navigate('/login');
        return;
      }

      try {
        const token = localStorage.getItem('accessToken');
        await axios.post(`/teachers/${teacherId}/add-student`, null, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Вы успешно добавлены к учителю');
        navigate('/lessons');
      } catch (error) {
        toast.error('Ошибка при добавлении к учителю');
        navigate('/');
      }
    };

    joinTeacher();
  }, [teacherId, user, checkAuth, navigate]);

  return <div>Загрузка...</div>;
};

export default JoinTeacherPage;
