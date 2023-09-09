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
    // const [games, setGames] = useState([]); // TODO

    useEffect(() => {
        const fetchList = async () => {
            try {
                const listData = await BoardGameFinderApi.getList(listId);
                console.log(listData)
                setList(listData);
            } catch (err) {
                console.error(err);
            }
        }
        fetchList();
    }, [listId]);

    if (!list) {
        return (
            <></>
        )
    }

    const gamesComp = list.games.map(g => (
        <li key={g.bggId}>{g.title}</li>
    ));

    // TODO make useful
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