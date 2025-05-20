import api from '../utils/axios';

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/profile'),
  updateProfile: (email, data) => api.put(`/profile/${email}`, data),
  deleteProfile: (email) => api.delete(`/profile/${email}`),
};

export const lessonsAPI = {
  getAll: (params) => api.get('/lessons', { params }),
  getById: (id) => api.get(`/lessons/${id}`),
  create: (data) => api.post('/lessons', data),
  update: (id, data) => api.put(`/lessons/${id}`, data),
  delete: (id) => api.delete(`/lessons/${id}`),
  getTeacherLessons: (teacherId) => api.get(`/teacher/${teacherId}/lessons`),
  takeLesson: (lessonId, studentId) => api.post(`/lessons/${lessonId}/take`, {}, { params: { studentId } }),
  switchLesson: (lessonId, studentId, otherStudentId) => 
    api.post(`/lessons/${lessonId}/switch`, {}, { 
      params: { studentId, otherStudentId } 
    }),
  approveSwitchLesson: (lessonId, studentId, approve) => 
    api.post(`/lessons/${lessonId}/approve-switch`, {}, { 
      params: { studentId, approve } 
    }),
};

export const materialsAPI = {
  getAll: (params) => api.get('/materials', { params }),
  getById: (id) => api.get(`/material/${id}`),
  create: (data) => api.post('/materials', data),
  update: (id, data) => api.put(`/materials/${id}`, data),
  delete: (id) => api.delete(`/materials/${id}`),
  getByTeacher: (teacherId, params) => api.get('/materials', { params: { ...params, teacherId } }),
  getPublic: (params) => api.get('/materials', { params: { ...params, isPublic: true } }),
  downloadFile: (id) => api.get(`/materials/${id}/download`, { responseType: 'blob' }),
};

export const teachersAPI = {
  getAll: () => api.get('/teachers'),
  getById: (id) => api.get(`/teachers/${id}`),
  getStudents: () => api.get('/teacher/students'),
  getLessons: (id) => api.get(`/teacher/${id}/lessons`),
  addStudent: (teacherId) => api.post(`/teachers/${teacherId}/add-student`),
};

export const studentsAPI = {
  getTeachers: () => api.get('/student/teachers'),
};

export const homeworksAPI = {
  getAll: (params) => api.get('/homeworks', { params }),
  getById: (id) => api.get(`/homeworks/${id}`),
  create: (data) => api.post('/homeworks', data),
  update: (id, data) => api.put(`/homeworks/${id}`, data),
  delete: (id) => api.delete(`/homeworks/${id}`),
  updateStatus: (id, status) => api.patch(`/homeworks/${id}/status`, status),
  getForStudentFromTeacher: (studentId, teacherId, params) => 
    api.get('/homeworks', { 
      params: { 
        ...params, 
        studentId, 
        teacherId 
      } 
    }),
};

export const commentsAPI = {
  getByHomework: (homeworkId) => api.get(`/homeworks/${homeworkId}/comments`),
  create: (data) => api.post('/comments', data),
  update: (id, data) => api.put(`/comments/${id}`, data),
  delete: (id) => api.delete(`/comments/${id}`),
};