import React from 'react';

function Home() {
  return (
    <div className="home-container">
      <div className="user-name-tag">NARESH</div>
      <div className="home-icon-wrapper">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="80" 
          height="80" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="home-icon"
        >
          <path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0" />
          {/* Using a book/ledger like icon */}
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" fill="var(--bg-dark)" stroke="currentColor" />
          <path d="M8 7h6M8 11h8M8 15h6" stroke="var(--primary)" strokeWidth="2" />
        </svg>
      </div>
      <h1 className="home-title">Hishab Khata</h1>
      <p className="home-subtitle">
        Your complete financial management system. Select a module from the menu above to get started.
      </p>
    </div>
  );
}

export default Home;
