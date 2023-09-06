import React, { useContext, useEffect, useState } from "react";
import BoardGameFinderApi from "../apis/bgfAPI";

import UserContext from "../auth/UserContext";
import GameCard from "../games/GameCard";

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
        <div>
            {resultsComp}
        </div>
    );
}

export default TrendingGames;
