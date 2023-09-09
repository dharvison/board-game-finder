import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, CardSubtitle, CardTitle, Row } from "reactstrap";
import BoardGameFinderApi from "../apis/bgfAPI";
import UserContext from "../auth/UserContext";


/**
 * Profile View
 */
function ProfileView() {
    const { currentUser } = useContext(UserContext);

    const [notes, setNotes] = useState([]);
    const [lists, setLists] = useState([]);

    useEffect(() => {
        async function fetchUserNotes() {
            try {
                const result = await BoardGameFinderApi.getUserNotes(currentUser.data.id);
                if (result) {
                    setNotes(result);
                }
            } catch (err) {
                console.error(err);
            }
        }
        fetchUserNotes();
    }, [currentUser]); // Probably needs something to update on creation TODO

    useEffect(() => {
        async function fetchUserLists() {
            try {
                const result = await BoardGameFinderApi.getUserLists(currentUser.data.id);
                if (result) {
                    setLists(result);
                }
            } catch (err) {
                console.error(err);
            }
        }
        fetchUserLists();
    }, [currentUser]); // Probably needs something to update on creation TODO

    const noteComp = notes.map(note => (
        <li key={note.id}><Link to={`/games/${note.gameId}`}>{note.title}</Link></li>
    ));

    const listComp = lists.map(list => (
        <li key={list.id}><Link to={`/lists/${list.id}`}>{list.title}</Link></li>
    ));


    return (
        <div className="Profile container col-md-12">
            <Row>
                <h1><span className="display-title">Welcome {currentUser.data.username}</span> <Link className="btn btn-outline-light" to="/user/profile/edit">Edit</Link> </h1>
            </Row>
            <Row>
                <div className="col-md-5">
                    <Card>
                        <CardTitle>{currentUser.data.name}</CardTitle>
                        <CardSubtitle>{currentUser.data.email}</CardSubtitle>
                        <CardSubtitle><span>Location:</span> {currentUser.data.city}, {currentUser.data.country}</CardSubtitle>
                        <CardBody>
                            {currentUser.data.bio}
                        </CardBody>
                    </Card>
                </div>

                <div className="col-md-3">
                    <Card>
                        <CardTitle>My Notes{/* <Link className="btn btn-sm btn-outline-primary" to={`/notes/create`}>Create</Link>*/}</CardTitle>
                        <CardBody>
                            <ul>
                                {noteComp}
                            </ul>
                        </CardBody>
                    </Card>

                </div>

                <div className="col-md-3">
                    <Card>
                        <CardTitle>My Lists <Link className="btn btn-sm btn-outline-primary" to={`/lists/create`}>Create</Link></CardTitle>
                        <CardBody>
                            <ul>
                                {listComp}
                            </ul>
                        </CardBody>
                    </Card>
                </div>
            </Row>

            {/* Todo Messages? */}
        </div>
    )
}

export default ProfileView;