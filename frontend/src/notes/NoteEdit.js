import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BoardGameFinderApi from "../apis/bgfAPI";
import { Card, Row } from "reactstrap";
import GameDetail from "../games/GameDetail";
import NoteForm from "./NoteForm";
import LoadingSpinner from "../common/LoadingSpinner";

/**
 * Edit Note page
 */
function NoteEdit() {
    const { noteId } = useParams();
    const [note, setNote] = useState(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const noteRes = await BoardGameFinderApi.getNote(noteId);
                setNote(noteRes);
            } catch (err) {
                console.error(err);
            }
            setLoaded(true);
        }
        setLoaded(false);
        fetchNote();
    }, [noteId]);

    if (!loaded) {
        return (<LoadingSpinner />);
    }

    if (!note.game.bggId) {
        return (<h1>You always leave a note!</h1>);
    }

    return (
        <div className="GameDetail container">
            <Row>
                <div className="col-md-5">
                    <Card>
                        <GameDetail bggId={note.game.bggId} />
                    </Card>
                </div>

                <div className="col-md-6">
                    <Card>
                        <NoteForm bggId={note.game.bggId} note={note} />
                    </Card>
                </div>
            </Row>
        </div >
    );
}

export default NoteEdit;