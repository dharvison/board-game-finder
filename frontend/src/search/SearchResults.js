import React, { useContext, useEffect, useState } from "react";
import BoardGameFinderApi from "../apis/bgfAPI";

import UserContext from "../auth/UserContext";
import GameCard from "../games/GameCard";
import LoadingSpinner from "../common/LoadingSpinner";
import { Row } from "reactstrap";
import CreateAddListPopup from "../lists/CreateAddListPopup";

/**
 * Search Results
 */
function SearchResults() {
    const [results, setResults] = useState([]);
    const [emptyResults, setEmptyResults] = useState(false);
    const { searchTerm, setSearchTerm } = useContext(UserContext);
    const [createAddGameId, setCreateAddGameId] = useState(null);

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
        <GameCard game={result} key={result.bggId} setCreateAddGameId={setCreateAddGameId} />
    ));

    const emptyComp = emptyResults ? <h1>Nothing!</h1> : <></>;

    return (
        <div>
            <CreateAddListPopup gameId={createAddGameId} setGameId={setCreateAddGameId} />
            <h1><span className="display-title">Search Results for {searchTerm}</span> {spinnerComp}</h1>
            <Row className="container">
                {resultsComp}
                {emptyComp}
            </Row>
        </div>
    );
}

export default SearchResults;
