// ErrorPage.js

import React from 'react';
import './ErrorPage.css'; // Import the CSS file for styling

const ErrorPage = () => {
  return (
    <div className='parent'>
        <div className="error-container">
        <h1 className='htag'>Something Went Wrong</h1>
        <p className='ptag'>We're sorry, but an error occurred. Please try again later.</p>
    </div>
    </div>
  );
};

export default ErrorPage;
