/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Agenda from './components/Agenda';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import ClientBooking from './components/ClientBooking';
import ProtectedRoute from './components/ProtectedRoute';

import { AppointmentProvider } from './context/AppointmentContext';

// Layout for internal pages (Sidebar + Content)
function AdminLayout() {
  return (
    <AppointmentProvider>
      <div className="flex min-h-screen bg-background text-on-surface font-body-md antialiased">
        <Sidebar />
        <Outlet />
      </div>
    </AppointmentProvider>
  );
}

export default function App() {
  return (
    <Router basename="/agenda">
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Rutas Privadas / Protegidas */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* El Outlet renderizará esto cuando la ruta sea /dashboard */}
          <Route path="dashboard" element={<Agenda />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
