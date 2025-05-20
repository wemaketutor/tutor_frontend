import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { teachersAPI } from '../../services/api';
import styles from './AddStudentToLesson.module.css';
import LoadingWrapper from '../../components/Loader/LoadingWrapper';
import { AuthContext } from '../../utils/AuthContext';
import { toast } from 'react-toastify';

const AddStudentToLesson = () => {
    const { lessonId } = useParams();
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState('');
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const loadStudents = async () => {
        try {
            const response = await teachersAPI.getStudents();
            setStudents(response.data.students || []);
        } catch (error) {
            console.error('Ошибка при загрузке учеников:', error.response?.data || error.message);
            toast.error('Не удалось загрузить список учеников');
        }
    };

    useEffect(() => {
        loadStudents();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedStudent) {
            toast.error('Пожалуйста, выберите ученика');
            return;
        }

        try {
            await teachersAPI.addStudent(selectedStudent);
            toast.success('Ученик успешно добавлен к уроку');
            navigate(`/lessons/${lessonId}`);
        } catch (error) {
            console.error('Ошибка при добавлении ученика:', error.response?.data || error.message);
            if (error.response?.status === 400) {
                toast.error('Ученик уже добавлен к этому уроку');
            } else {
                toast.error('Не удалось добавить ученика');
            }
        }
    };

    return (
        <LoadingWrapper onLoad={loadStudents} shouldLoad={!students}>
            <div className={styles.container}>
                <h1 className={styles.title}>Добавить ученика к уроку</h1>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="student">Выберите ученика:</label>
                        <select
                            id="student"
                            value={selectedStudent}
                            onChange={(e) => setSelectedStudent(e.target.value)}
                            className={styles.select}
                            required
                        >
                            <option value="">Выберите ученика</option>
                            {students.map((student) => (
                                <option key={student.id} value={student.id}>
                                    {student.firstName} {student.lastName} ({student.email})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.buttonGroup}>
                        <button type="submit" className={styles.submitButton}>
                            Добавить
                        </button>
                        <button
                            type="button"
                            className={styles.cancelButton}
                            onClick={() => navigate(`/lessons/${lessonId}`)}
                        >
                            Отмена
                        </button>
                    </div>
                </form>
            </div>
        </LoadingWrapper>
    );
};

export default AddStudentToLesson; 