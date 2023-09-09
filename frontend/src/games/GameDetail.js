import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BoardGameFinderApi from "../apis/bgfAPI";
import { CardBody, CardImg, CardSubtitle, CardTitle } from "reactstrap";
import LoadingSpinner from "../common/LoadingSpinner";

/**
 * Game Detail
 */
function GameDetail({ bggId }) {
    const [game, setGame] = useState(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const fetchGame = async () => {
            try {
                const gameData = await BoardGameFinderApi.getGame(bggId);
                setGame(gameData);
            } catch (err) {
                console.error(err);
            }
            setLoaded(true);
        }
        setLoaded(false);
        fetchGame();
    }, [bggId]);

    if (!loaded) {
        return (<LoadingSpinner />);
    }

    if (!game) {
        return (
            <></>
        )
    }

    return (
        <>
            <CardTitle><Link to={`https://boardgamegeek.com/boardgame/${game.bggId}/`} target="_blank">{game.title}</Link></CardTitle>
            <CardSubtitle>Designed by {game.designer}</CardSubtitle>
            <CardSubtitle>Published {game.year}</CardSubtitle>
            <CardBody>
                <CardImg src={game.coverUrl} alt={`Cover for ${game.title}`} />
            </CardBody>
            {/* TODO Add to list! */}
        </>
    );
}

export default GameDetail;