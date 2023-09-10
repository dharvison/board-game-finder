import React, { useEffect, useState } from "react";
import BoardGameFinderApi from "../apis/bgfAPI";
import GameCard from "../games/GameCard";
import { Row } from "reactstrap";
import CreateAddListPopup from "../lists/CreateAddListPopup";

/**
 * Trending Games
 */
function TrendingGames() {
    const [results, setResults] = useState([]);
    const [createAddGameId, setCreateAddGameId] = useState(null);

    useEffect(() => {
        async function fetchTrending() {
            try {
                const result = await BoardGameFinderApi.trending();
                setResults(result);
            } catch (err) {
                console.error(err);
            }
        }
        fetchTrending();
    }, []);

    const resultsComp = results.map(result => (
        <GameCard game={result} key={result.bggId} setCreateAddGameId={setCreateAddGameId} />
    ));

    return (
        <>
            <CreateAddListPopup gameId={createAddGameId} setGameId={setCreateAddGameId} />
            <Row className="container">
                {resultsComp}
            </Row>
        </>
    );
}

export default TrendingGames;
