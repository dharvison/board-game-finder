import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import BoardGameFinderApi from "../apis/bgfAPI";
import { Card, CardBody, CardText } from "reactstrap";

/**
 * List Detail page
 */
function ListDetail() {
    const { listId } = useParams();
    const [list, setList] = useState(null);

    useEffect(() => {
        const fetchList = async () => {
            try {
                const listData = await BoardGameFinderApi.getList(listId);
                setList(listData);
            } catch (err) {
                console.error(err);
            }
        }
        fetchList();
    }, [listId]);

    async function removeGame(bggId) {
        try {
            console.log(bggId);
            const removeRes = await BoardGameFinderApi.removeGameFromList(listId, bggId);
            if (removeRes) {
                // handle messaging
                console.log(removeRes);
                setList({
                    id: list.id,
                    title: list.title,
                    blurb: list.blurb,
                    games: list.games.filter(g => (g.bggId != bggId))
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

    // TODO add link to remove game
    const gamesComp = list.games.map(g => (
        <li key={g.bggId}><Link to={`/games/${g.bggId}`}>{g.title}</Link> <Link className="link-danger" onClick={() => removeGame(g.bggId)}><i className="fa fa-1x fa-window-close"></i></Link></li>
    ));

    
    return (
        <div className="ListDetail container col-md-6">
            <h1 className="display-title">{list.title}</h1>
            <Card>
                <CardBody>
                    <CardText>{list.blurb}</CardText>
                    
                    <ul>
                        {gamesComp}
                    </ul>

                </CardBody>
                <Link className="btn btn-primary" to={`/lists/${list.id}/edit`}>Edit List</Link>
                <Link className="btn btn-primary" to={`/lists/${list.id}/edit`}>Add Game TODO</Link>
            </Card>
        </div>
    );
}

export default ListDetail;