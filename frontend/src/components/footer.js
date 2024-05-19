import React from 'react';
import '../css/header.css';

const Footer = () => {
  return (
<footer className="footer mt-auto py-3" style={{ position: 'fixed', left: 0, bottom: 0, width: '100%' }}>
      <div className="container text-center">
        <span style={{ color: '#ccc' }}>© 2024 Laundry App. All rights reserved.</span>
      </div>
    </footer>
  );
};

export default Footer;
