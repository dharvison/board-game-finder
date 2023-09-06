import React, { useContext, useEffect, useState } from "react";
import BoardGameFinderApi from "../apis/bgfAPI";

import { NavLink } from "react-router-dom";
import { Navbar, Nav, NavItem, Input, Collapse, Button, Card, CardBody } from "reactstrap";
import UserContext from "../auth/UserContext";
import SearchGameCard from "./SearchGameCard";

/**
 * Search Results
 */
function SearchResults() {
    // const { searchTerm, setSearchTerm } = useContext(UserContext);
    const [results, setResults] = useState([]);
    const { searchTerm, setSearchTerm } = useContext(UserContext);

    useEffect(() => {
        async function fetchSearchResults() {
            try {
                const result = await BoardGameFinderApi.search(searchTerm);
                setResults(result);
            } catch (err) {
                console.error(err);
            }
        }
        fetchSearchResults();
    }, [searchTerm, setSearchTerm]);

    const resultsComp = results.map(result => (
        <SearchGameCard game={result} key={result.bggId} />
    ));

    return (
        <div>
            <h1>Results for {searchTerm}</h1>
            {resultsComp}
        </div>
    );
}

export default SearchResults;
