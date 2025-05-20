import { useState } from 'react';
import { teachersAPI } from '../services/api';

export const useTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [teacher, setTeacher] = useState(null);
  const [students, setStudents] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [shareLink, setShareLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTeachers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await teachersAPI.getAll();
      setTeachers(response.data || []);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Не удалось загрузить учителей');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchTeacherById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await teachersAPI.getById(id);
      setTeacher(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Не удалось загрузить информацию об учителе');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchTeacherStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await teachersAPI.getStudents();
      setStudents(response.data.students || []);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Не удалось загрузить студентов учителя');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchTeacherLessons = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await teachersAPI.getLessons(id);
      setLessons(response.data.lessons || []);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Не удалось загрузить уроки учителя');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getShareLink = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await teachersAPI.getShareLink(id);
      setShareLink(response.data.shareLink);
      return response.data.shareLink;
    } catch (err) {
      setError(err.response?.data?.message || 'Не удалось получить ссылку приглашения');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addStudentToTeacher = async (teacherId) => {
    setLoading(true);
    setError(null);
    try {
      await teachersAPI.addStudent(teacherId);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Не удалось добавить студента к учителю');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    teachers,
    teacher,
    students,
    lessons,
    shareLink,
    loading,
    error,
    fetchTeachers,
    fetchTeacherById,
    fetchTeacherStudents,
    fetchTeacherLessons,
    getShareLink,
    addStudentToTeacher,
  };
}; 