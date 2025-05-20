import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Chip,
} from '@mui/material';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

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

const LessonList: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const response = await fetch(`/api/lessons/user/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setLessons([...data.ownerLessons, ...data.followerLessons]);
        }
      } catch (error) {
        console.error('Error fetching lessons:', error);
      }
    };

    fetchLessons();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Мои уроки</Typography>
        <Button
          component={Link}
          to="/lessons/create"
          variant="contained"
          color="primary"
        >
          Создать урок
        </Button>
      </Box>

      <Grid container spacing={3}>
        {lessons.map((lesson) => (
          <Grid item xs={12} md={6} lg={4} key={lesson.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {lesson.name}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {lesson.subject}
                </Typography>
                <Typography variant="body2" paragraph>
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
                  <Chip
                    label="Есть домашнее задание"
                    color="primary"
                    size="small"
                    sx={{ mr: 1 }}
                  />
                )}
                <Button
                  component={Link}
                  to={`/lessons/${lesson.id}`}
                  variant="outlined"
                  size="small"
                  sx={{ mt: 2 }}
                >
                  Подробнее
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default LessonList; 