import React, { useContext } from "react";
import "./NavBar.css";

import { NavLink } from "react-router-dom";
import { Navbar, Nav, NavItem, Collapse } from "reactstrap";
import UserContext from "../auth/UserContext";
import SearchBar from "../search/SearchBar";

/**
 * Navigation Bar
 */
function NavBar({ logout }) {
  const { currentUser } = useContext(UserContext);

  const loggedInLeftLinks = () => (
    <NavItem>
      <NavLink to="/trending" className="nav-item">Browse Games</NavLink>
      <NavLink to="/players" className="nav-item">Find Players</NavLink>
      {/* <NavLink to="/notes/create" className="nav-item">Create Note</NavLink> */}
      <NavLink to="/lists/create" className="nav-item">Create a List</NavLink>
    </NavItem>
  )

  const anonLeftLinks = () => (
    <NavItem>
      <NavLink to="/trending" className="nav-item">Browse Games</NavLink>
    </NavItem>
  )

  const loggedInRightLinks = () => (
    <NavItem>
      <NavLink to="/inbox" className="nav-item">Inbox</NavLink>
      <NavLink to="/users/profile" className="nav-item">Profile</NavLink>
      <NavLink to="/logout" onClick={logout} className="nav-item">Logout</NavLink>
    </NavItem>
  )

  const anonRightLinks = () => (
    <NavItem>
      <NavLink to="/signup" className="nav-item">Sign Up</NavLink>
      <NavLink to="/login" className="nav-item">Log In</NavLink>
    </NavItem>
  )

  return (
    <Navbar expand="md">
      <Nav navbar>
      <NavLink to="/" className="navbar-brand">
        Bored? Game Finder
      </NavLink>
        <Collapse isOpen={true} className="my-auto">
          <Nav navbar>
            {currentUser.loaded ? loggedInLeftLinks() : anonLeftLinks()}
          </Nav>
        </Collapse>
      </Nav>
      <SearchBar className="mr-auto" />



      <Nav className="ml-auto" navbar>
        {currentUser.loaded ? loggedInRightLinks() : anonRightLinks()}
      </Nav>
    </Navbar>
  );
}

export default NavBar;
