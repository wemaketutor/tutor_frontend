import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Events from './pages/Events/Events';
import About from './pages/About/About';
import Login from './pages/Auth/Login.jsx';
import Register from './pages/Auth/Register.jsx';
import Teachers from './pages/Teachers/Teachers';
import Lessons from './pages/Lessons/Lessons.jsx';
import Lesson from './pages/Lesson/Lesson.jsx';
import Homeworks from './pages/Homeworks/Homeworks.jsx';
import Homework from './pages/Homework/Homework.jsx';
import Resources from './pages/Resources/Resources';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Profile from './pages/Profile/Profile';
import QA from './pages/QA/QA';
import Teacher from './pages/Teacher/Teacher';
import { AuthProvider } from './utils/AuthContext.jsx';

function App() {
  return (
    <AuthProvider>
      <Header key={window.location.pathname} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/lessons" element={<Lessons />} />
        <Route path="/lesson/:lessonId" element={<Lesson />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/homeworks" element={<Homeworks />} />
        <Route path="/homework/:homeworkId" element={<Homework />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/qa" element={<QA />} />
        <Route path="/teacher/:id" element={<Teacher />} /> {/* Динамический маршрут */}
      </Routes>
      <Footer />
    </AuthProvider>
  );
}

export default App;