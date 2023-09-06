import React, { useContext, useEffect, useState } from "react";
import BoardGameFinderApi from "../apis/bgfAPI";

import UserContext from "../auth/UserContext";
import GameCard from "../games/GameCard";
import { Spinner } from "reactstrap";
import { useNavigate } from "react-router-dom";

/**
 * Search Results
 */
function SearchResults() {
    const navigate = useNavigate();
    const [results, setResults] = useState([]);
    const { searchTerm, setSearchTerm } = useContext(UserContext);

    useEffect(() => {
        async function fetchSearchResults() {
            try {
                const result = await BoardGameFinderApi.search(searchTerm);
                if (!result.error) {
                    setResults(result);
                } else {
                    console.log(result);
                    // TODO DISPLAY
                }
            } catch (err) {
                console.error(err);
            }
        }
        setResults([]);
        fetchSearchResults();
    }, [searchTerm, setSearchTerm]);

    const resultsComp = results.map(result => (
        <GameCard game={result} key={result.bggId} />
    ));

    if (searchTerm == null || searchTerm.length < 1) {
        return (
            <div>
                <h1>Search term required!</h1>
            </div>
        );
    }

    if (!results || results.length == 0) {
        return (
            <div>
                <h1>Results for {searchTerm} <Spinner type="border" color="primary" /></h1>
            </div>
        );
    }

    return (
        <div>
            <h1>Results for {searchTerm}</h1>
            {resultsComp}
        </div>
    );
}

export default SearchResults;
