import React from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, CardTitle, CardText } from "reactstrap";

/**
 * Game Card
 */
function GameCard({ game }) {

    const imgComp = game.coverUrl ? <img src={game.coverUrl} /> : <></>;

    return (
        <Card>
            <CardBody>
                <CardTitle><Link to={`/games/${game.bggId}`}>{game.title}</Link></CardTitle>
                <CardText>
                    {imgComp}
                    {game.year}
                </CardText>
            </CardBody>
        </Card>
    );
}

export default GameCard;
