import React from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, CardTitle, CardText, CardSubtitle } from "reactstrap";
import AddToList from "../lists/AddToList";

/**
 * Game Card
 */
function GameCard({ game, setCreateAddGameId }) {

    const imgComp = game.coverUrl ? <img src={game.coverUrl} alt={`Cover for ${game.title}`} /> : <></>;

    return (
        <div className="col-xl-4 col-md-6">
            <Card>
                <CardBody>
                    <CardTitle><Link to={`/games/${game.bggId}`}>{game.title}</Link></CardTitle>
                    {/* <CardSubtitle>Designed by {game.designer}</CardSubtitle> */}
                    <CardSubtitle>Published {game.year}</CardSubtitle>
                    {/* <CardBody>
                        <CardImg src={game.coverUrl} alt={`Cover for ${game.title}`} />
                    </CardBody> */}
                    <CardText>
                        {imgComp}
                    </CardText>

                    <Link className="btn btn-primary" to={`/notes/create/${game.bggId}`}>Create Note</Link>
                    {' '}
                    <AddToList bggId={game.bggId} setCreateAddGameId={setCreateAddGameId} />
                </CardBody>
            </Card>
        </div>
    );
}

export default GameCard;
