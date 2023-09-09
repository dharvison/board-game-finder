import React, { useEffect, useState } from "react";
import BoardGameFinderApi from "../apis/bgfAPI";
import GameCard from "../games/GameCard";
import { Row } from "reactstrap";

/**
 * Trending Games
 */
function TrendingGames() {
    const [results, setResults] = useState([]);

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
        <GameCard game={result} key={result.bggId} />
    ));

    return (
        <Row className="container">
            {resultsComp}
        </Row>
    );
}

export default TrendingGames;
