import React from "react";
import { Link } from "react-router-dom";
import BoardGameFinderApi from "../apis/bgfAPI";
import { CardBody, CardText, CardTitle } from "reactstrap";

/**
 * List Detail page
 */
function ListDetail({ list, setList }) {

    async function removeGame(bggId) {
        try {
            const removeRes = await BoardGameFinderApi.removeGameFromList(list.id, bggId);
            if (removeRes) {
                // handle messaging
                console.log(removeRes);
                setList({
                    id: list.id,
                    title: list.title,
                    blurb: list.blurb,
                    games: list.games.filter(g => (g.bggId !== bggId))
                });
            }
        } catch (err) {
            console.error(err);
        }
    }

    if (!list) {
        return (
            <></>
        )
    }

    const gamesComp = list.games.map(g => (
        <li key={g.bggId}><Link to={`/games/${g.bggId}`}>{g.title}</Link> <Link className="link-danger" onClick={() => removeGame(g.bggId)}><i className="fa fa-1x fa-window-close"></i></Link></li>
    ));

    return (<>
        <CardBody>
            <CardText>{list.blurb}</CardText>
            <CardTitle>Games</CardTitle>
            <ul>
                {gamesComp}
            </ul>

        </CardBody>
    </>);
}

export default ListDetail;