import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { lessonsAPI } from '../services/api';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalLessons: 0,
    upcomingLessons: 0,
    completedLessons: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await lessonsAPI.getAll({
          page: 1,
          per_page: 100,
          sort_by: 'date',
          sort_order: 'desc',
        });

        const now = new Date();
        const lessons = user.role === 'teacher'
          ? response.data.ownerLessons
          : response.data.followerLessons;

        const stats = {
          totalLessons: lessons.length,
          upcomingLessons: lessons.filter(lesson => new Date(lesson.date) > now).length,
          completedLessons: lessons.filter(lesson => new Date(lesson.date) <= now).length,
        };

        setStats(stats);
      } catch (error) {
        console.error('Ошибка при загрузке статистики:', error);
        toast.error('Не удалось загрузить статистику');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Добро пожаловать, {user?.firstName}!
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
            }}
          >
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Всего уроков
            </Typography>
            <Typography component="p" variant="h4">
              {stats.totalLessons}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
            }}
          >
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Предстоящие уроки
            </Typography>
            <Typography component="p" variant="h4">
              {stats.upcomingLessons}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
            }}
          >
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Завершенные уроки
            </Typography>
            <Typography component="p" variant="h4">
              {stats.completedLessons}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 