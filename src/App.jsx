import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/public/Landing';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import GarageDashboard from './pages/garage/GarageDashboard';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import MechanicDashboard from './pages/mechanic/MechanicDashboard';
import SupplierDashboard from './pages/supplier/SupplierDashboard';
import FinanceDashboard from './pages/finance/FinanceDashboard';
import './styles/globals.css';


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                   element={<Landing />} />
        <Route path="/login"              element={<Login />} />
        <Route path="/register"           element={<Register />} />
        <Route path="/garage/dashboard"   element={<GarageDashboard />} />
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        <Route path="/mechanic/dashboard" element={<MechanicDashboard />} />
        <Route path="/supplier/dashboard"  element={<SupplierDashboard />} />
        <Route path="/finance/dashboard"  element={<FinanceDashboard />} />
        
      </Routes>
    </BrowserRouter>
  );
}
