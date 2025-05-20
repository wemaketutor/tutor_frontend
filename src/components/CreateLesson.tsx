import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { lessonsAPI } from '../services/api';
import { toast } from 'react-toastify';
import styles from './CreateLesson.module.css';

interface CreateLessonProps {
  students: Array<{
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  }>;
}

const CreateLesson: React.FC<CreateLessonProps> = ({ students }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    subject: '',
    startTime: new Date(),
    endTime: new Date(),
    studentIds: [] as number[],
    homeworkLink: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        date: formData.startTime.toISOString(),
        duration: formData.endTime.toISOString(),
      };

      await lessonsAPI.create(payload);
      toast.success('Урок успешно создан');
      navigate('/lessons');
    } catch (error) {
      console.error('Ошибка при создании урока:', error);
      toast.error('Не удалось создать урок');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: new Date(value),
    }));
  };

  const handleStudentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => Number(option.value));
    setFormData((prev) => ({
      ...prev,
      studentIds: selectedOptions,
    }));
  };

  return (
    <div className={styles.container}>
      <h1>Создание нового урока</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Название урока *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Описание</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="subject">Предмет</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="startTime">Время начала *</label>
          <input
            type="datetime-local"
            id="startTime"
            name="startTime"
            value={formData.startTime.toISOString().slice(0, 16)}
            onChange={handleDateChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="endTime">Время окончания *</label>
          <input
            type="datetime-local"
            id="endTime"
            name="endTime"
            value={formData.endTime.toISOString().slice(0, 16)}
            onChange={handleDateChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="students">Ученики</label>
          <select
            id="students"
            name="students"
            multiple
            value={formData.studentIds.map(String)}
            onChange={handleStudentChange}
          >
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.firstName} {student.lastName} ({student.email})
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="homeworkLink">Ссылка на домашнее задание</label>
          <input
            type="url"
            id="homeworkLink"
            name="homeworkLink"
            value={formData.homeworkLink}
            onChange={handleInputChange}
          />
        </div>

        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.submit}>
            Создать урок
          </button>
          <button
            type="button"
            className={styles.cancel}
            onClick={() => navigate('/lessons')}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateLesson; 