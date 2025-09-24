import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminPage from '../../app/AdminPage';
import PrivateRoute from '../PrivateRoute';
import ProfilePage from '../../app/ProfilePage';
import App from '../../../App';

function RouterSetup() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App/>} />
        <Route
          path="/admin"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AdminPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default RouterSetup;