import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Events from './pages/Events/Events';
import About from './pages/About/About';
import Login from './pages/Auth/Login.jsx';
import Register from './pages/Auth/Register.jsx';
import Teachers from './pages/Teachers/Teachers';
import LessonsTeacher from './pages/LessonsTeacher/LessonsTeacher.jsx';
import Resources from './pages/Resources/Resources';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Profile from './pages/Profile/Profile';
import QA from './pages/QA/QA';
import Timetable from './pages/Timetable/Timetable';
import { AuthProvider } from './utils/AuthContext.jsx'; // Импорт AuthProvider

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
        <Route path="/lessonsteacher" element={<LessonsTeacher />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/qa" element={<QA />} />
        <Route path="/timetable" element={<Timetable />} />
      </Routes>
      <Footer />
    </AuthProvider>
  );
}

export default App;