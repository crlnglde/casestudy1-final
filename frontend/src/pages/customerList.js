import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/header'; 
import Footer from '../components/footer';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/customer/getlist'); 
        setCustomers(response.data.customers); 
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <div> 
        <Header/>{}
        <div className="container mt-5">
        <br /><br />
        <h2 className="mb-4">Customer List</h2>
        <table className="table table-dark table-striped">
            <thead>
            <tr>
                <th>Name</th>
                <th>Username</th>
                
                
                <th>Joined At</th>
            </tr>
            </thead>
            <tbody>
            {customers.map(customer => (
                <tr key={customer._id}>
                <td>{customer.firstName} {customer.lastName}</td>
                <td>{customer.username}</td>
                
                
                <td>{new Date(customer.createdAt).toDateString()}</td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
        <Footer/>{}
    </div>
  );
};

export default CustomerList;
