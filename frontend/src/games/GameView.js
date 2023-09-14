import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Row } from "reactstrap";
import NoteDetail from "../notes/NoteDetail";
import GameDetail from "../games/GameDetail";
import CreateAddListPopup from "../lists/CreateAddListPopup";
import FindGamePlayers from "./FindGamePlayers";

/**
 * Game View page
 */
function GameView({ locale }) {
    const { bggId } = useParams();
    const [createAddGameId, setCreateAddGameId] = useState(null);

    return (
        <div className="GameDetail container">
            <CreateAddListPopup gameId={createAddGameId} setGameId={setCreateAddGameId} />
            <Row>
                <div className="col-md-5">
                    <Card>
                        <GameDetail bggId={bggId} setCreateAddGameId={setCreateAddGameId} />
                    </Card>
                </div>
                <div className="col-md-6">
                    <Card>
                        {locale ? <FindGamePlayers bggId={bggId} locale={locale} /> : <NoteDetail bggId={bggId} />}
                    </Card>
                </div>
            </Row>
        </div >
    );
}

export default GameView;