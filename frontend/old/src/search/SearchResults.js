import React, { useContext, useEffect, useState } from "react";
import "./SearchBar.css";
import BoardGameFinderApi from "../apis/bgfAPI";

import { NavLink } from "react-router-dom";
import { Navbar, Nav, NavItem, Input, Collapse, Button } from "reactstrap";
import UserContext from "../auth/UserContext";

/**
 * Search Bar
 */
function SearchResults() {
    // const { searchTerm, setSearchTerm } = useContext(UserContext);
    const [results, setResults] = useState([]);
    const searchTerm = "ticket";

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        const res = await BoardGameFinderApi.search(searchTerm);

    }

    useEffect(() => {
        async function fetchSearchResults() {
            try {
                const result = await BoardGameFinderApi.search("ticket");
                setResults(result);
                console.log(result)
            } catch (err) {
                console.error(err);
            }
            fetchSearchResults();
        }
    }, []);

    // useEffect(() => {
    //     async function fetchSearchResults() {
    //         try {
    //             const result = await BoardGameFinderApi.search(searchTerm);
    //             setResults(result);
    //         } catch (err) {
    //             console.error(err);
    //         }
    //         fetchSearchResults();
    //     }
    // }, [searchTerm]);

    /** Update form data field */
    function handleChange(evt) {
        const { name, value } = evt.target;
        // setSearchTerm(value);
    }

    return (
        <h1>HELLLO!@</h1>
        // <form class="d-none d-md-flex flex-md-grow-1 flex-lg-grow-0 w-50 me-2" role="search" onSubmit={handleSubmit}>
        //     <Input name="term" value={searchTerm} onChange={handleChange}
        //         type="search" placeholder="Search" aria-label="Search" class="form-control me-1" />
        //     <Button class="btn btn-light" type="submit">Search</Button>
        // </form>
    );
}

export default SearchResults;
