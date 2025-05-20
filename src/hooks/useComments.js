import { useState } from 'react';
import { commentsAPI } from '../services/api';

export const useComments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCommentsByHomework = async (homeworkId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await commentsAPI.getByHomework(homeworkId);
      setComments(response.data || []);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Не удалось загрузить комментарии');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createComment = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await commentsAPI.create(data);
      setComments((prevComments) => [...prevComments, response.data]);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Не удалось создать комментарий');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateComment = async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await commentsAPI.update(id, data);
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === id ? response.data : comment
        )
      );
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Не удалось обновить комментарий');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteComment = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await commentsAPI.delete(id);
      setComments((prevComments) => prevComments.filter((comment) => comment.id !== id));
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Не удалось удалить комментарий');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    comments,
    loading,
    error,
    fetchCommentsByHomework,
    createComment,
    updateComment,
    deleteComment,
  };
}; 