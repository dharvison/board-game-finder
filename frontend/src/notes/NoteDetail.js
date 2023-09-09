import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BoardGameFinderApi from "../apis/bgfAPI";
import { CardBody, CardSubtitle, CardText, CardTitle } from "reactstrap";
import UserContext from "../auth/UserContext";
import LoadingSpinner from "../common/LoadingSpinner";

/**
 * Note Detail
 */
function NoteDetail({ bggId }) {
    const { currentUser } = useContext(UserContext);
    const [note, setNote] = useState(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const userNote = await BoardGameFinderApi.getUserNoteForGame(currentUser.data.id, bggId);
                setNote(userNote);
            } catch (err) {
                console.error(err);
            }
            setLoaded(true);
        }
        setLoaded(false);
        fetchNote();
    }, [bggId, currentUser]);

    if (!loaded) {
        return (<LoadingSpinner />);
    }

    if (!note) {
        return (
            <>
                <CardTitle>My Note <Link className="btn btn-sm btn-outline-primary" to={`/notes/create/${bggId}`}>Create Note</Link></CardTitle>
                <CardBody>
                    <CardText>None</CardText>
                </CardBody>
            </>
        )
    }

    return (
        <>
            <CardTitle>My Note <Link className="btn btn-sm btn-outline-primary" to={`/notes/${note.id}/edit `}>Edit Note</Link></CardTitle>
            <CardBody>
                <CardSubtitle>{note.own ? "Own it" : "Don't Own it"}</CardSubtitle>
                <CardSubtitle>{note.wantToPlay ? "Let's play it" : "Not looking to play"}</CardSubtitle>
                <CardText>{note.note}</CardText>
            </CardBody>
        </>
    );
}

export default NoteDetail;