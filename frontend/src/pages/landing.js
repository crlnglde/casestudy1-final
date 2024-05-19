import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header1 from '../components/header1'; // Import Header component
import Footer from '../components/footer'; // Import Footer component
import '../css/landing.css'; // Import CSS file

function OrdersSearch() {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:3000/order/getorders')
            .then(response => {
                setOrders(response.data);
            })
            .catch(error => {
                console.error('Error fetching orders:', error);
            });
    }, []);

    const handleSearch = () => {
        setIsSearching(true);
        const results = orders.filter(order =>
            order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(results);
    };

    return (
        <div className="orders-search-container">
            <Header1 />
            <div className="jumb">
                <h1>Curious if your laundry is ready for pick-up?  </h1>
                <h3>Let's see if it's done with its spa day!</h3>
                <div className="search-bar">
                    <input 
                        type="text" 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                        placeholder="Enter Order Number..." 
                        className="search-in"
                    />
                    <button className="search-button" onClick={handleSearch}>Search</button>
                </div>
                <div className="search-results">
                    {isSearching && searchResults.length === 0 && (
                        <p className="no-results-message">No results found</p>
                    )}
                    {searchResults.length > 0 && (
                        <table className="search-results-table">
                            <thead>
                                <tr>
                                    <th>Order Number</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {searchResults.map(order => (
                                    <tr key={order._id}>
                                        <td>{order.orderNumber}</td>
                                        <td>{order.firstName}</td>
                                        <td>{order.lastName}</td>
                                        <td>{order.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default OrdersSearch;
