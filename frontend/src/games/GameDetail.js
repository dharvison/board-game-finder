import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BoardGameFinderApi from "../apis/bgfAPI";
import { Card, CardBody } from "reactstrap";

/**
 * Game Detail page
 */
function GameDetail() {
    const { bggId } = useParams();
    const [game, setGame] = useState(null);

    useEffect(() => {
        const fetchGame = async () => {
            try {
                const gameData = await BoardGameFinderApi.getGame(bggId);
                setGame(gameData);
            } catch (err) {
                console.error(err);
            }
        }
        fetchGame();
    }, [bggId]);

    if (!game) {
        return (
            <></>
        )
    }

    // TODO make useful
    return (
        <div className="GameDetail container col-md-6">
            <Card>
                <CardBody>
                    <h2>{game.title}</h2>
                    <h6 className="subtitle">{game.designer}</h6>
                    <h6 className="subtitle">{game.year}</h6>
                    <img src={game.coverUrl} width={500} />

                </CardBody>
            </Card>
        </div>
    );
}

export default GameDetail;