import { useState } from 'react';
import { studentsAPI } from '../services/api';

export const useStudents = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStudentTeachers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await studentsAPI.getTeachers();
      setTeachers(response.data.teachers || []);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Не удалось загрузить учителей студента');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    teachers,
    loading,
    error,
    fetchStudentTeachers,
  };
}; 