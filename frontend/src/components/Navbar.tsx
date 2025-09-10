import React from "react";

const Navbar: React.FC = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav className="navbar">
      <h2>Suivi Dépenses</h2>
      <button onClick={handleLogout}>Déconnexion</button>
    </nav>
  );
};

export default Navbar;
