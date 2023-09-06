import React from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, CardTitle, CardText } from "reactstrap";

/**
 * Search Game Card Results
 */
function SearchGameCard({game}) {


    return (
        <Card>
            <CardBody>
                <CardTitle><Link to={`/games/${game.bggId}`}>{game.title}</Link></CardTitle>
                <CardText>
                    {/* TODO image/thumbnail */}
                    {game.year}
                </CardText>
            </CardBody>
        </Card>
    );
}

export default SearchGameCard;
