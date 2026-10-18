import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Layout from './components/Layout.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Students from './pages/Students.jsx';
import NotFound from './pages/NotFound.jsx';
export default function App(){const {user}=useAuth();return <Routes><Route path="/" element={<Navigate to={user?'/dashboard':'/login'} replace/>}/><Route path="/login" element={user?<Navigate to="/dashboard" replace/>:<Login/>}/><Route path="/register" element={user?<Navigate to="/dashboard" replace/>:<Register/>}/><Route element={<ProtectedRoute/>}><Route element={<Layout/>}><Route path="/dashboard" element={<Dashboard/>}/><Route path="/students" element={<Students/>}/></Route></Route><Route path="*" element={<NotFound/>}/></Routes>}
