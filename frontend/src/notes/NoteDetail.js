import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BoardGameFinderApi from "../apis/bgfAPI";
import { Card, CardBody } from "reactstrap";

/**
 * Note Detail page
 */
function NoteDetail() {
    const { noteId } = useParams();
    const [note, setNote] = useState(null);

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const noteData = await BoardGameFinderApi.getNote(noteId);
                console.log(noteData)
                setNote(noteData);
            } catch (err) {
                console.error(err);
            }
        }
        fetchNote();
    }, [noteId]);

    if (!note) {
        return (
            <></>
        )
    }

    // TODO make useful
    return (
        <div className="NoteDetail container col-md-6">
            <Card>
                <CardBody>
                    <h2>{note.id}</h2>
                    <h6 className="subtitle">{note.gameId}</h6>
                    <h6 className="subtitle">{note.note}</h6>
                    <h6 className="subtitle">{note.own ? 'I own it' : 'nope'}</h6>
                    <h6 className="subtitle">{note.wantToPlay ? 'let us play' : 'naw'}</h6>

                </CardBody>
            </Card>
        </div>
    );
}

export default NoteDetail;