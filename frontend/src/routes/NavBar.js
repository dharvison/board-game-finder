import React, { useContext } from "react";
import "./NavBar.css";

import { NavLink } from "react-router-dom";
import { Navbar, Nav, NavItem, Collapse } from "reactstrap";
import UserContext from "../auth/UserContext";
// import SearchBar from "../search/SearchBar";

/**
 * Navigation Bar
 */
function NavBar({ logout }) {
  const { currentUser } = useContext(UserContext);

  const loggedInLeftLinks = () => (
    <NavItem>
      <NavLink to="/browse" className="nav-item">Browse</NavLink>
      <NavLink to="/user/notes/create" className="nav-item">Create Note</NavLink>
      {/* TODO dropdown! */}
    </NavItem>
  )

  const loggedInRightLinks = () => (
    <NavItem>
      <NavLink to="/user/profile" className="nav-item">Profile</NavLink>
      <NavLink to="/logout" onClick={logout} className="nav-item">Logout</NavLink>
    </NavItem>
  )

  const anonRightLinks = () => (
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
        {/* TODO logic for collapsing! */}
        <Collapse isOpen={true}>
          <Nav className="mr-auto" navbar>
            {currentUser.loaded ? loggedInLeftLinks() : ''}
          </Nav>
        </Collapse>

        {/* <SearchBar /> */}


        <Nav className="ml-auto" navbar>
          {currentUser.loaded ? loggedInRightLinks() : anonRightLinks()}
        </Nav>
      </Navbar>
    </div>
  );
}

export default NavBar;
