import React, { useContext } from "react";
import "./NavBar.css";

import { NavLink } from "react-router-dom";
import { Navbar, Nav, NavItem } from "reactstrap";
import UserContext from "../auth/UserContext";

/**
 * Navigation Bar
 */
function NavBar({ logout }) {
  const { currentUser } = useContext(UserContext);

  const loggedInLinks = () => (
    <NavItem>
      <NavLink to="/companies" className="nav-item">Companies</NavLink>
      <NavLink to="/jobs" className="nav-item">Jobs</NavLink>
      <NavLink to="/profile" className="nav-item">Profile</NavLink>
      <NavLink to="/logout" onClick={logout} className="nav-item">Logout</NavLink>
    </NavItem>
  )

  const anonLinks = () => (
    <NavItem>
      <NavLink to="/signup" className="nav-item">Sign Up</NavLink>
      <NavLink to="/login" className="nav-item">Login</NavLink>
    </NavItem>
  )

  return (
    <div>
      <Navbar expand="md">
        <NavLink to="/" className="navbar-brand">
          Bored? Game Finder
        </NavLink>

        <Nav className="ml-auto" navbar>
          {currentUser.loaded ? loggedInLinks() : anonLinks()}
        </Nav>
      </Navbar>
    </div>
  );
}

export default NavBar;
