import { useState } from 'react';
import { lessonsAPI } from '../services/api';

export const useLessons = () => {
  const [lessons, setLessons] = useState([]);
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLessons = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await lessonsAPI.getAll(params);
      setLessons(response.data.lessons || []);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Не удалось загрузить уроки');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchLessonById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await lessonsAPI.getById(id);
      setLesson(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Не удалось загрузить урок');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createLesson = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await lessonsAPI.create(data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Не удалось создать урок');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateLesson = async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await lessonsAPI.update(id, data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Не удалось обновить урок');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteLesson = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await lessonsAPI.delete(id);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Не удалось удалить урок');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    lessons,
    lesson,
    loading,
    error,
    fetchLessons,
    fetchLessonById,
    createLesson,
    updateLesson,
    deleteLesson,
  };
}; 