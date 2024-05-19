import React from 'react';
import { Route, Routes } from 'react-router-dom'; // Import Route and Routes from react-router-dom
import CusList from '../pages/customerList'; // Import OrderList component


const labaduhRoutes = () => {
  return (
    <Routes>
      
      <Route path="/customers" element={<CusList />} />
      
    </Routes>
  );
};

export default labaduhRoutes;
