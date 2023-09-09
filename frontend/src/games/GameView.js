import React from "react";
import { useParams } from "react-router-dom";
import { Card, Row } from "reactstrap";
import NoteDetail from "../notes/NoteDetail";
import GameDetail from "../games/GameDetail";

/**
 * Game View page
 */
function GameView() {
    const { bggId } = useParams();

    return (
        <div className="GameDetail container">
            <Row>
                <div className="col-md-5">
                    <Card>
                        <GameDetail bggId={bggId} />
                    </Card>
                </div>
                <div className="col-md-6">
                    <Card>
                        <NoteDetail bggId={bggId} />
                    </Card>
                </div>
            </Row>
        </div >
    );
}

export default GameView;