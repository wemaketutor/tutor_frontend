import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Login from './pages/Auth/Login.jsx';
import Register from './pages/Auth/Register.jsx';
import Teachers from './pages/Teachers/Teachers';
import Lessons from './pages/Lessons/Lessons.jsx';
import Lesson from './pages/Lesson/Lesson.jsx';
import NewLesson from './pages/NewLesson/NewLesson.jsx';
import Homeworks from './pages/Homeworks/Homeworks.jsx';
import Homework from './pages/Homework/Homework.jsx';
import NewHomework from './pages/NewHomework/NewHomework.jsx';
import Materials from './pages/Materials/Materials.jsx';
import Material from './pages/Material/Material.jsx';
import NewMaterial from './pages/NewMaterial/NewMaterial.jsx';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Profile from './pages/Profile/Profile';
import QA from './pages/QA/QA';
import Teacher from './pages/Teacher/Teacher';
import { AuthProvider } from './utils/AuthContext.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <Header key={window.location.pathname} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/lessons" element={<Lessons />} />
        <Route path="/lesson/:lessonId" element={<Lesson />} />
        <Route path="/lessons/new" element={<NewLesson />} />
        <Route path="/materials" element={<Materials />} />
        <Route path="/materials/new" element={<NewMaterial />} />
        <Route path="/material/:materialId" element={<Material />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/homeworks" element={<Homeworks />} />
        <Route path="/homeworks/new" element={<NewHomework />} />
        <Route path="/homework/:homeworkId" element={<Homework />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/qa" element={<QA />} />
        <Route path="/teacher/:id" element={<Teacher />} />
      </Routes>
      <ToastContainer 
        position="bottom-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
      />
      <Footer />
    </AuthProvider>
  );
}

export default App;