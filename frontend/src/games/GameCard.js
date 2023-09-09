import React from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, CardTitle, CardText, CardSubtitle } from "reactstrap";

/**
 * Game Card
 */
function GameCard({ game }) {

    const imgComp = game.coverUrl ? <img src={game.coverUrl} alt={`Cover for ${game.title}`} /> : <></>;

    return (
        <div className="col-xl-4 col-md-6">
            <Card>
                <CardBody>
                    <CardTitle><Link to={`/games/${game.bggId}`}>{game.title}</Link></CardTitle>
                    <CardSubtitle>{game.year}</CardSubtitle>
                    <CardText>
                        {imgComp}
                    </CardText>
                    {/* TODO! */}
                    <Link className="btn btn-primary" to={`/notes/create/${game.bggId}`}>Create Note</Link>
                    <Link className="btn btn-primary" to="/lists/create">Create List</Link>
                </CardBody>
            </Card>
        </div>
    );
}

export default GameCard;
