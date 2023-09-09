import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Row } from "reactstrap";
import GameDetail from "../games/GameDetail";
import NoteForm from "./NoteForm";
import UserContext from "../auth/UserContext";
import BoardGameFinderApi from "../apis/bgfAPI";
import LoadingSpinner from "../common/LoadingSpinner";

/**
 * Create Note page
 */
function NoteCreate() {
    const { bggId } = useParams();
    const { currentUser } = useContext(UserContext);
    const [note, setNote] = useState(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const noteRes = await BoardGameFinderApi.getUserNoteForGame(currentUser.data.id, bggId);
                setNote(noteRes);
            } catch (err) {
                console.error(err);
            }
            setLoaded(true);
        }
        setLoaded(false);
        fetchNote();
    }, [bggId]);

    if (!loaded) {
        return (<LoadingSpinner />);
    }

    if (!bggId) {
        // TODO search for one!
        return (<h1>Need game!</h1>);
    }

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
                        <NoteForm bggId={bggId} note={note} />
                    </Card>
                </div>
            </Row>
        </div >
    );
}

export default NoteCreate;