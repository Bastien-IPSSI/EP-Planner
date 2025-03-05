import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import Login from './Pages/login';

import Chantiers from './Pages/admin/chantiers/Chantiers';
import CreateChantier from './Pages/admin/chantiers/CreateChantier';
import ChantierInfo from './Pages/admin/chantiers/ChantierInfo';

import Ouvriers from './Pages/admin/ouvriers/Ouvriers';
import CreateOuvrier from './Pages/admin/ouvriers/CreateOuvrier';
import OuvrierInfo from './Pages/admin/ouvriers/OuvrierInfo';

import UserChantiers from './Pages/user/chantiers/UserChantiers';
import UserChantier from './Pages/user/chantiers/UserChantier';


import { BrowserRouter, Routes, Route, createBrowserRouter, RouterProvider, Outlet, Navigate } from "react-router-dom";
import Layout from './Components/Layout';

// import CustomNavbar from './Components/Nav';


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='login' element={<Login/>}/>
        <Route element={<Layout/>}>
        {/* Protected Routes */}
          <Route path='/admin/chantiers' element={<Chantiers/>}/>
          <Route path='/admin/chantiers/new' element={<CreateChantier/>}/>
          <Route path='/admin/chantiers/:id' element={<ChantierInfo/>}/>

          <Route path='/admin/ouvriers' element={<Ouvriers/>}/>
          <Route path='/admin/ouvriers/new' element={<CreateOuvrier/>}/>
          <Route path='/admin/ouvriers/:id' element={<OuvrierInfo/>}/>
        {/* Protected Routes */}

        <Route path='/chantiers' element={<UserChantiers/>}/>        
        <Route path='/chantiers/:id' element={<UserChantier/>}/>        
        </Route>
      </Routes>
    </BrowserRouter>


  );
};

export default App;
