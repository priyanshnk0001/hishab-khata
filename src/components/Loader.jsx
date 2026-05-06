import React from 'react';
import './Loader.css';

const Loader = () => {
  return (
    <div className="loader-overlay">
      <div className="book-loader">
        <div className="book-page"></div>
        <div className="book-page"></div>
        <div className="book-page"></div>
      </div>
      <p className="loader-status">Updating Records...</p>
    </div>
  );
};

export default Loader;
