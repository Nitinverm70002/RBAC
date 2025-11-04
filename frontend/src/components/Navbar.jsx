import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import "../styles.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Detect scroll for fade-in effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) setScrolled(true);
      else setScrolled(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`sticky-navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="nav-left">
        <Link to="/" className="logo">
          <span className="logo-icon">⚙️</span> RBAC Dashboard
        </Link>
      </div>

      <div className="nav-right">
        <Link
          to="/"
          className={`nav-link ${location.pathname === "/" ? "active-link" : ""}`}
        >
          Home
        </Link>

        {user ? (
          <>
            <span className="user-info">
              {user.email}
              <span className="role-badge">{user.role}</span>
            </span>
            <button className="btn logout" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className={`btn login ${
              location.pathname === "/login" ? "active-btn" : ""
            }`}
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
