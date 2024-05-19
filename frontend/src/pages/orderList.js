import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/header'; 
import Footer from '../components/footer';
import '../css/orderlist.css';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [readyForPickupOrders, setReadyForPickupOrders] = useState([]);
  const [pickedUpOrders, setPickedUpOrders] = useState([]);
  const [searchOrder, setSearchOrder] = useState(''); 
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderIdToDelete, setOrderIdToDelete] = useState(null);
  const [activeStatus, setActiveStatus] = useState('pending');

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:3000/order/getorders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (orders && orders.length > 0) {
     
      const pending = orders.filter(order => order.status === 'pending');
      setPendingOrders(pending);
      setReadyForPickupOrders(orders.filter(order => order.status === 'ready for pick-up'));
      setPickedUpOrders(orders.filter(order => order.status === 'picked-up'));
      setFilteredOrders(pending);
    }
  }, [orders]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:3000/order/updatestatus/${orderId}`, { status: newStatus });
      fetchOrders();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleOrderDelete = async (orderId) => {
    try {
      await axios.delete(`http://localhost:3000/order/delete/${orderId}`);
      fetchOrders();
      setShowConfirmation(false);
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const openConfirmationModal = (orderId) => {
    setOrderIdToDelete(orderId);
    setShowConfirmation(true);
  };

  const closeConfirmationModal = () => {
    setShowConfirmation(false);
  };

  const handleSearchOrder = () => {
    const filtered = orders.filter(order => order.orderNumber.toLowerCase().includes(searchOrder.toLowerCase()));
    setFilteredOrders(filtered);
  };

  const handleStatusFilter = (status) => {
    setActiveStatus(status);
    switch (status) {
      case 'pending':
        setFilteredOrders(pendingOrders);
        break;
      case 'ready for pick-up':
        setFilteredOrders(readyForPickupOrders);
        break;
      case 'picked-up':
        setFilteredOrders(pickedUpOrders);
        break;
      default:
        setFilteredOrders(pendingOrders);
    }
  };

  return (
    <div>
      <Header />
      <div className="container">
        <br /><br />
        <h1>Order List</h1>
        
        <div className="row">
          <div className="col">
            <a href="/labaduh/order/new" className="btn btn-success">Create New Order</a>
          </div>

          <div className="col">
            <div className="btn-group" role="group" aria-label="Status Filter">
              <button 
                type="button" 
                className={`btn btn-secondary1 ${activeStatus === 'pending' ? 'active' : ''}`} 
                onClick={() => handleStatusFilter('pending')}
              >
                Pending
              </button>
              <button 
                type="button" 
                className={`btn btn-secondary2 ${activeStatus === 'ready for pick-up' ? 'active' : ''}`} 
                onClick={() => handleStatusFilter('ready for pick-up')}
              >
                Ready for Pick-up
              </button>
              <button 
                type="button" 
                className={`btn btn-secondary3 ${activeStatus === 'picked-up' ? 'active' : ''}`} 
                onClick={() => handleStatusFilter('picked-up')}
              >
                Picked-up
              </button>
            </div>
          </div>

          <div className="col">
            <div className="input-group">
              <input type="text" className="form-control" placeholder="Search Order Number" value={searchOrder} onChange={(e) => setSearchOrder(e.target.value)} />
              <div className="input-group-append">
                <button className="btn btn-search" type="button" onClick={handleSearchOrder}>Search</button>
              </div>
            </div>
          </div>

        </div>
        <div className="row">
          {filteredOrders && filteredOrders.length > 0 ? (
            filteredOrders.map(order => (
              <div key={order._id} className="col-md-4 col1">
                <div className="card h-100">
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">Order Number: {order.orderNumber}</h5>
                    <p className="card-text">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                    <p className="card-text">Customer Name: {order.firstName} {order.lastName}</p>
                    <p className="card-text">Service: {order.service}</p>
                    <p className="card-text">Type: {order.type}</p>
                    <p className="card-text">Kilo: {order.kilo}</p>
                    <p className="card-text">Price: {order.price}</p>

                    <div className="form-group1 mt-auto">
                      <label htmlFor={`status-${order._id}`}>Status: </label>
                      <select id={`status-${order._id}`} className="form-control" value={order.status} onChange={(e) => handleStatusUpdate(order._id, e.target.value)}>
                        <option value="pending">Pending</option>
                        <option value="ready for pick-up">Ready for Pick-up</option>
                        <option value="picked-up">Picked-up</option>
                      </select>
                    </div>

                    {order.status === 'pending' && <button className="btn btn-danger mt-2" onClick={() => openConfirmationModal(order._id)}>Delete</button>}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No Record...</p>
          )}
        </div>

        <div className="lower-portion">
      
      </div>

      </div>

      {showConfirmation && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)', position: 'fixed', top: 0, bottom: 0, left: 0, right: 0 }}>
          <div className="modal-dialog" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this order?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeConfirmationModal}>Cancel</button>
                <button type="button" className="btn btn-danger" onClick={() => handleOrderDelete(orderIdToDelete)}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer/>
    </div>

  );
};

export default OrderList;
