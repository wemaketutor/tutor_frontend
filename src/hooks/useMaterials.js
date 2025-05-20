import { useState } from 'react';
import { materialsAPI } from '../services/api';

export const useMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMaterials = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await materialsAPI.getAll(params);
      setMaterials(response.data.materials || []);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Не удалось загрузить материалы');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchMaterialById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await materialsAPI.getById(id);
      setMaterial(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Не удалось загрузить материал');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createMaterial = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await materialsAPI.create(data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Не удалось создать материал');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateMaterial = async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await materialsAPI.update(id, data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Не удалось обновить материал');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteMaterial = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await materialsAPI.delete(id);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Не удалось удалить материал');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    materials,
    material,
    loading,
    error,
    fetchMaterials,
    fetchMaterialById,
    createMaterial,
    updateMaterial,
    deleteMaterial,
  };
}; 