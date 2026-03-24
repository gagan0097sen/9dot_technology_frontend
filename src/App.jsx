import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'antd/dist/reset.css';
import './App.css';

import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import TasksPage from './pages/TasksPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/tasks" element={<TasksPage />} />
        </Route>
        <Route path="*" element={<LoginPage />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={2500} />
    </>
  );
}

export default App;
