import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BoardGameFinderApi from "../apis/bgfAPI";
import { CardBody, CardImg, CardSubtitle, CardTitle } from "reactstrap";
import LoadingSpinner from "../common/LoadingSpinner";
import AddToList from "../lists/AddToList";
import UserContext from "../auth/UserContext";

/**
 * Game Detail
 */
function GameDetail({ bggId, setCreateAddGameId }) {
    const { currentUser } = useContext(UserContext);
    const [game, setGame] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [gameLists, setGameLists] = useState([]);

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

    useEffect(() => {
        const fetchLists = async () => {
            try {
                const listsRes = await BoardGameFinderApi.getUserListsWithGameId(currentUser.data.id, bggId);
                console.log(listsRes);
                setGameLists(listsRes);
            } catch (err) {
                console.error(err);
            }
        }
        fetchLists();
    }, [bggId, currentUser]);

    function addToList(list) {
        const updateLists = gameLists.map(l => (l));
        updateLists.push(list);
        setGameLists(updateLists);
    }

    if (!loaded) {
        return (<LoadingSpinner />);
    }

    if (!game) {
        return (
            <></>
        )
    }

    const listsComp = gameLists.map(l => {
        return (<li key={l.id}><Link to={`/lists/${l.id}`}>{l.title}</Link></li>);
    });

    return (
        <>
            <CardTitle><Link to={`/games/${game.bggId}/`}>{game.title}</Link></CardTitle>
            <CardSubtitle>Designed by {game.designer}</CardSubtitle>
            <CardSubtitle>Published {game.year}</CardSubtitle>
            <CardBody>
                <CardImg src={game.coverUrl} alt={`Cover for ${game.title}`} />
            </CardBody>
            <AddToList bggId={game.bggId} setCreateAddGameId={setCreateAddGameId} addToList={addToList} />
            <Link className="btn btn-outline-primary mt-1" to={`/games/${game.bggId}/local`}>Find Players in Your City</Link>
            <Link className="btn btn-outline-primary mt-1" to={`/games/${game.bggId}/state`}>Find Players in Your State</Link>
            <Link className="btn btn-outline-secondary mt-1" to={`https://boardgamegeek.com/boardgame/${game.bggId}/`} target="_blank">View on BoardGameGeek</Link>
            <CardTitle className="my-1">In Your lists: </CardTitle>
            {gameLists.length > 0 ? <ul>{listsComp}</ul> : <CardSubtitle>None</CardSubtitle>}
        </>
    );
}

export default GameDetail;