import { Box, Typography, Button, Container, Grid } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Home = () => {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          py: 8,
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          Добро пожаловать в TutorAsBetter
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Ваша платформа для эффективного обучения и преподавания
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            component={RouterLink}
            to="/register"
            sx={{ mr: 2 }}
          >
            Начать сейчас
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            component={RouterLink}
            to="/login"
          >
            Войти
          </Button>
        </Box>
      </Box>

      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12} md={4}>
          <Box sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h5" gutterBottom>
              Удобное обучение
            </Typography>
            <Typography color="text.secondary">
              Интуитивно понятный интерфейс для эффективного обучения
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h5" gutterBottom>
              Профессиональные преподаватели
            </Typography>
            <Typography color="text.secondary">
              Опытные преподаватели с проверенной квалификацией
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h5" gutterBottom>
              Гибкое расписание
            </Typography>
            <Typography color="text.secondary">
              Выбирайте удобное время для занятий
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home; 