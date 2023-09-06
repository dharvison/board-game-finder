import React, { useContext, useState } from "react";
import "./SearchBar.css";
import BoardGameFinderApi from "../apis/bgfAPI";

import { NavLink, useNavigate } from "react-router-dom";
import { Navbar, Nav, NavItem, Input, Collapse, Button } from "reactstrap";
import UserContext from "../auth/UserContext";

/**
 * Search Bar
 */
function SearchBar() {
    const navigate = useNavigate();
    const { searchTerm, setSearchTerm } = useContext(UserContext);
    // const searchTerm = "Foobar";

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        // console.log(searchTerm);
        // setSearchTerm(searchTerm);
        // const res = await BoardGameFinderApi.search(searchTerm);
        navigate('/search');

    }

    /** Update form data field */
    function handleChange(evt) {
        const { name, value } = evt.target;
        setSearchTerm(value); // TODO this will be a problem
    }

    return (
        <form className="d-none d-md-flex flex-md-grow-1 flex-lg-grow-0 w-50 me-2" role="search" onSubmit={handleSubmit}>
            <Input name="term" value={searchTerm} onChange={handleChange}
                type="search" placeholder="Search" aria-label="Search" className="form-control me-1" />
            <Button className="btn btn-light" type="submit">Search</Button>
        </form>
    );
}

export default SearchBar;
