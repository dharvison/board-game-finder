import React, { useContext, useEffect, useState } from "react";
import BoardGameFinderApi from "../apis/bgfAPI";

import UserContext from "../auth/UserContext";
import GameCard from "../games/GameCard";
import LoadingSpinner from "../common/LoadingSpinner";

/**
 * Search Results
 */
function SearchResults() {
    const [results, setResults] = useState([]);
    const [emptyResults, setEmptyResults] = useState(false);
    const { searchTerm, setSearchTerm } = useContext(UserContext);

    useEffect(() => {
        async function fetchSearchResults() {
            try {
                const result = await BoardGameFinderApi.search(searchTerm);
                if (!result.error) {
                    setResults(result);
                } else {
                    console.log(result);
                    if (result.error === "No games!") {
                        setEmptyResults(true);
                    }
                }
            } catch (err) {
                console.error(err);
            }
        }
        setResults([]);
        setEmptyResults(false);
        
        if (searchTerm != null && searchTerm.length > 0) {
            fetchSearchResults();
        }
    }, [searchTerm, setSearchTerm]);

    if (searchTerm == null || searchTerm.length < 1) {
        return (<div><h1 className="display-title">Search term required! Enter a search above.</h1></div>);
    }

    const spinnerComp = (!results || results.length === 0) && !emptyResults ? <LoadingSpinner /> : <></>;

    const resultsComp = results.map(result => (
        <GameCard game={result} key={result.bggId} />
    ));

    const emptyComp = emptyResults ? <h1>Nothing!</h1> : <></>;

    return (
        <div>
            <h1><span className="display-title">Search Results for {searchTerm}</span> {spinnerComp}</h1>
            {resultsComp}{emptyComp}
        </div>
    );
}

export default SearchResults;
