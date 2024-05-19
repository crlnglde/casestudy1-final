import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Landing from './pages/landing.js';
import LabaduhRoute from './f-routes/labaduhRoutes'; 
import ListCus from './f-routes/listCusRoutes.js'; 
 
import Auth from './f-routes/auth.js'; 

import './App.css';

const App = () => {
  return (
    <Router>
      <div className="App">
      
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />

          
          <Route path="/auth/*" element={<Auth />} />
          <Route path="/labaduh/*" element={<LabaduhRoute/>} />
          <Route path="/labaduhh/*" element={<ListCus/>} />
          
        </Routes>
        
      </div>
    </Router>
  );
};

export default App;
