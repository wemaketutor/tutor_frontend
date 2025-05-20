import { useState } from 'react';
import { homeworksAPI } from '../services/api';

export const useHomeworks = () => {
  const [homeworks, setHomeworks] = useState([]);
  const [homework, setHomework] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHomeworks = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await homeworksAPI.getAll(params);
      setHomeworks(response.data.homeworks || []);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Не удалось загрузить домашние задания');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchHomeworkById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await homeworksAPI.getById(id);
      setHomework(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Не удалось загрузить домашнее задание');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createHomework = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await homeworksAPI.create(data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Не удалось создать домашнее задание');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateHomework = async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await homeworksAPI.update(id, data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Не удалось обновить домашнее задание');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteHomework = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await homeworksAPI.delete(id);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Не удалось удалить домашнее задание');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateHomeworkStatus = async (id, status) => {
    setLoading(true);
    setError(null);
    try {
      const response = await homeworksAPI.updateStatus(id, status);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Не удалось обновить статус домашнего задания');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    homeworks,
    homework,
    loading,
    error,
    fetchHomeworks,
    fetchHomeworkById,
    createHomework,
    updateHomework,
    deleteHomework,
    updateHomeworkStatus,
  };
}; 