import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/header'; 
import Footer from '../components/footer';
import '../css/orderform.css';
import moment from 'moment-timezone';


const NewOrderForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    type: 'regular load',
    kilo: '',
    service: 'Wash and Dry', // Default service option
    price: 0 ,// Initialize price to 0
    description: '',
    status: 'pending' // Added status with default value
  });

  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const { firstName, lastName, type, kilo, service, description, status, price } = formData;

  const calculatePrice = () => {
    // Check if any of the required fields is empty
    if (!firstName || !lastName || !type || !kilo || !service) {
      setFormData({ ...formData, price: 0 });
      return;
    }
  
    let calculatedPrice = 0;
  
    if (type === 'regular load') {
      if (service === 'Wash and Dry') {
        if (kilo >= 1 && kilo <= 8) {
          calculatedPrice = 250;
        } else {
          calculatedPrice = 250 + (32 * (kilo - 8));
        }
      } else if (service === 'Wash Only') {
        if (kilo >= 1 && kilo <= 8) {
          calculatedPrice = 125;
        } else {
          calculatedPrice = 125 + (16 * (kilo - 8));
        }
      } else if (service === 'Dry Only') {
        if (kilo >= 1 && kilo <= 8) {
          calculatedPrice = 125;
        } else {
          calculatedPrice = 125 + (16 * (kilo - 8));
        }
      }
    } else if (type === 'heavy load') {
      if (service === 'Wash and Dry') {
        if (kilo >= 1 && kilo <= 5) {
          calculatedPrice = 280;
        } else {
          calculatedPrice = 280 + (56 * (kilo - 5));
        }
      } else if (service === 'Wash Only') {
        if (kilo >= 1 && kilo <= 5) {
          calculatedPrice = 140;
        } else {
          calculatedPrice = 140 + (28 * (kilo - 5));
        }
      } else if (service === 'Dry Only') {
        if (kilo >= 1 && kilo <= 5) {
          calculatedPrice = 140;
        } else {
          calculatedPrice = 140 + (28 * (kilo - 5));
        }
      }
    }
  
    setFormData({ ...formData, price: calculatedPrice });
  };
  

  // useEffect hook to call calculatePrice whenever any of the relevant form fields change
  useEffect(() => {
    calculatePrice();
  }, [firstName, lastName, type, kilo, service]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {

      const createdAtPHTime = moment().tz('Asia/Manila').format();

      // Post the order data to the server
      const response = await axios.post("http://localhost:3000/order/postorder", {
        firstName,
        lastName,
        type,
        kilo,
        service,
        price,
        description,
        status,
        createdAt: createdAtPHTime  // Add createdAt field with current date
      });

      // Extract the order number from the response
      const orderNumber = response.data.orderNumber;

      // Set the order number in the state
      setOrderNumber(orderNumber);

      // Show the receipt modal
      setShowReceiptModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCloseModal = () => {
    setShowReceiptModal(false);
    // Add the code to display the message "Order Added"
    alert('Order Added');
    // Reload the page after the message is displayed
    window.location.href = '/labaduh/order'; // Redirect to the order page
};


  return (
    <div>
      <Header />
      <div className="no-container">
        <br />
        <h1 className="mb-4">New Order Form</h1>
        <form onSubmit={handleSubmit}>
        
          <div className="fgg">
            <label htmlFor="firstName">First Name:</label>
            <input type="text" className="form-control" id="firstName" value={firstName} onChange={(event) => setFormData({ ...formData, firstName: event.target.value })} />
          </div>

          <div className="fgg">
            <label htmlFor="lastName">Last Name:</label>
            <input type="text" className="form-control" id="lastName" value={lastName} onChange={(event) => setFormData({ ...formData, lastName: event.target.value })} />
          </div>

          <div className="fgg">
            <label htmlFor="type">Item Type:</label>
            <select className="form-control" id="type" name="type" value={type} onChange={(event) => setFormData({ ...formData, type: event.target.value })}>
              <option value="regular load">Regular Load</option>
              <option value="heavy load">Heavy Load</option>
            </select>
          </div>

          <div className="fgg">
            <label htmlFor="kilo">Kilos:</label>
            <input type="number" className="form-control" id="kilo" name="kilo" value={kilo} onChange={(event) => setFormData({ ...formData, kilo: event.target.value })} />
          </div>

          <div className="fgg">
            <label htmlFor="service">Service:</label>
            <select className="form-control" id="service" name="service" value={service} onChange={(event) => setFormData({ ...formData, service: event.target.value })}>
                <option value="Wash and Dry">Wash and Dry</option>
                <option value="Dry Only">Dry Only</option>
                <option value="Wash Only">Wash Only</option>
            </select>
          </div>

          <div className="fgg">
            <label htmlFor="description">Description:</label>
            <textarea className="form-control" id="description" name="description" value={description} onChange={(event) => setFormData({ ...formData, description: event.target.value })}></textarea>
          </div>

          <div className="fgg">
            <label htmlFor="price">Price:</label>
            <input type="text" className="form-control" id="price" name="price" value={price} disabled />
          </div>
          
          <button type="submit" className="no-btn">Submit</button>
        </form>
      </div>

      {/* Modal for displaying receipt */}
      {showReceiptModal && (
  <div className="receipt-modal">
    <div className="receipt-modal-dialog">
      <div className="receipt-modal-content">
        <div className="receipt-modal-header">
          <h5 className="receipt-modal-title">Receipt</h5>
          <button type="button" className="receipt-modal-close" onClick={() => setShowReceiptModal(false)}>
            &times;
          </button>
        </div>

        <div className="receipt-modal-item">
                  <span className="receipt-modal-label">Order Number:</span>
                  <span className="receipt-modal-value">{orderNumber}</span>
          </div>

        <div className="receipt-modal-body">
          <div className="receipt-modal-item">
            <span className="receipt-modal-label">Name:</span>
            <span className="receipt-modal-value">{firstName} {lastName}</span>
          </div>
          <div className="receipt-modal-item">
            <span className="receipt-modal-label">Item Type:</span>
            <span className="receipt-modal-value">{type}</span>
          </div>
          <div className="receipt-modal-item">
            <span className="receipt-modal-label">Kilos:</span>
            <span className="receipt-modal-value">{kilo}</span>
          </div>
          <div className="receipt-modal-item">
            <span className="receipt-modal-label">Service:</span>
            <span className="receipt-modal-value">{service}</span>
          </div>
          <div className="receipt-modal-item">
            <span className="receipt-modal-label">Description:</span>
            <span className="receipt-modal-value">{description}</span>
          </div>
          <div className="receipt-modal-item">
            <span className="receipt-modal-label">Price:</span>
            <span className="receipt-modal-value">Php {price}</span>
          </div>

          

        </div>
        <div className="receipt-modal-footer">
        <button type="button" className="receipt-modal-button" onClick={handleCloseModal}>Close</button>
        </div>


      </div>
    </div>  
  </div>
)}

      <Footer />
    </div>
  );
};

export default NewOrderForm;
