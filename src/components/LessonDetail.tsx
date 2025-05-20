import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface Student {
  id: number;
  firstName: string;
  lastName: string;
}

interface Lesson {
  id: number;
  name: string;
  description: string;
  subject: string;
  startTime: string;
  endTime: string;
  homeworkLink: string;
  studentIds: number[];
}

const LessonDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await fetch(`/api/lessons/${id}`);
        if (response.ok) {
          const data = await response.json();
          setLesson(data);
        }
      } catch (error) {
        console.error('Error fetching lesson:', error);
      }
    };

    const fetchStudents = async () => {
      try {
        const response = await fetch('/api/students');
        if (response.ok) {
          const data = await response.json();
          setStudents(data);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchLesson();
    fetchStudents();
  }, [id]);

  if (!lesson) {
    return <Typography>Загрузка...</Typography>;
  }

  const lessonStudents = students.filter((student) =>
    lesson.studentIds.includes(student.id)
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">{lesson.name}</Typography>
        <Button
          component={Link}
          to="/lessons"
          variant="outlined"
          color="primary"
        >
          Назад к списку
        </Button>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Информация об уроке
          </Typography>
          <Typography color="textSecondary" gutterBottom>
            Предмет: {lesson.subject}
          </Typography>
          <Typography variant="body1" paragraph>
            {lesson.description}
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="textSecondary">
              Начало: {format(new Date(lesson.startTime), 'PPp', { locale: ru })}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Окончание: {format(new Date(lesson.endTime), 'PPp', { locale: ru })}
            </Typography>
          </Box>
          {lesson.homeworkLink && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Домашнее задание:
              </Typography>
              <Button
                href={lesson.homeworkLink}
                target="_blank"
                rel="noopener noreferrer"
                variant="contained"
                color="primary"
              >
                Открыть задание
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Ученики
          </Typography>
          <List>
            {lessonStudents.map((student, index) => (
              <React.Fragment key={student.id}>
                <ListItem>
                  <ListItemText
                    primary={`${student.firstName} ${student.lastName}`}
                  />
                </ListItem>
                {index < lessonStudents.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LessonDetail; 