import React from 'react';

const Header = ({ title }) => {
  return (
    <header className="admin-header">
      <h2>{title}</h2>
      <div className="admin-user-info">
        <span>Admin User</span>
      </div>
    </header>
  );
};

export default Header;
