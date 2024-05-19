import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTshirt, faHome, faListAlt, faUsers, faInfoCircle, faEnvelope, faUserCircle, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import logo from '../images/5.png'; 
import '../css/header.css';

const Header = () => {

  
  return (
    <header className="fixed-top">
      <nav className="navbar navbar-expand-lg navbar-dark  justify-content-center custom-navbar">
        <div className="container">
          <a className="navbar-brand" href="#">
            <img src={logo} alt="Laundry App Logo" width="180" height="80" className="d-inline-block align-top" />
          </a>
          <span className="ml-3 text-white"></span>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav">
                
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="/auth/login" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <FontAwesomeIcon icon={faSignOutAlt}  className="mr-1" />Admin Login
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
