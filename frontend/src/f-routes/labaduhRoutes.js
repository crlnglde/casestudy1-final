import React from 'react';
import { Route, Routes } from 'react-router-dom'; // Import Route and Routes from react-router-dom
import OrderList from '../pages/orderList'; // Import OrderList component
import NewOrderForm from '../components/newOrderForm.js';

const labaduhRoutes = () => {
  return (
    <Routes>
      
      <Route path="/order" element={<OrderList />} />
      <Route path="/order/new" element={<NewOrderForm />} />
      
    </Routes>
  );
};

export default labaduhRoutes;
