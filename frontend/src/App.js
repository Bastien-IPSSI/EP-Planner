import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from './Components/Login';
import Layout from './Components/Layout';

import Chantiers from './Pages/admin/chantiers/Chantiers';
import CreateChantier from './Pages/admin/chantiers/CreateChantier';
import ChantierInfo from './Pages/admin/chantiers/ChantierInfo';
import EditChantier from './Pages/admin/chantiers/EditChantier';

import Ouvriers from './Pages/admin/ouvriers/Ouvriers';
import CreateOuvrier from './Pages/admin/ouvriers/CreateOuvrier';
import OuvrierInfo from './Pages/admin/ouvriers/OuvrierInfo';

import UserChantier from './Pages/user/chantiers/UserChantier';

import Employe from './Pages/user/chantiers/Employe';

import { UserProvider, useUser } from './UserContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div>Chargement...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/chantiers" replace />;
  }

  return children;
};

const App = () => {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route element={<Layout />}>
            {/* Routes protégées pour ADMIN */}
            <Route
              path='/admin/chantiers'
              element={
                <ProtectedRoute requiredRole="ROLE_ADMIN">
                  <Chantiers />
                </ProtectedRoute>
              }
            />
            <Route
              path='/admin/chantiers/new'
              element={
                <ProtectedRoute requiredRole="ROLE_ADMIN">
                  <CreateChantier />
                </ProtectedRoute>
              }
            />
            <Route
              path='/admin/chantiers/:id/edit'
              element={
                <ProtectedRoute requiredRole="ROLE_ADMIN">
                  <EditChantier />
                </ProtectedRoute>
              }
            />

            <Route
              path='/admin/ouvriers'
              element={
                <ProtectedRoute requiredRole="ROLE_ADMIN">
                  <Ouvriers />
                </ProtectedRoute>
              }
            />
            <Route
              path='/admin/ouvriers/new'
              element={
                <ProtectedRoute requiredRole="ROLE_ADMIN">
                  <CreateOuvrier />
                </ProtectedRoute>
              }
              />
            <Route
              path='/admin/ouvriers/:id'
              element={
                <ProtectedRoute requiredRole="ROLE_ADMIN">
                  <OuvrierInfo />
                </ProtectedRoute>
              }
              />

            {/* Routes protégées pour UTILISATEUR (ouvrier) */}
              <Route 
                path="/chantiers" 
                element={
                  <ProtectedRoute requiredRole="ROLE_USER">
                    <Employe />
                  </ProtectedRoute>
                } 
              />
            {/* Routes non protégées */}
              <Route
                path='/chantiers/:id'
                element={
                  <ChantierInfo />
                }
                />
            </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
};

export default App;
