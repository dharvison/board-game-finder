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
    const [smartlists, setSmartlists] = useState([]);

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
    }, [currentUser]);

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
    }, [currentUser]);

    useEffect(() => {
        async function fetchSmartLists() {
            try {
                const result = await BoardGameFinderApi.getUserSmartlists(currentUser.data.id);
                if (result) {
                    setSmartlists(result.games);
                }
            } catch (err) {
                console.error(err);
            }
        }
        fetchSmartLists();
    }, [currentUser]);

    const noteComp = notes.map(note => (
        <li key={note.id}><Link to={`/games/${note.gameId}`}>{note.title}</Link></li>
    ));

    const listComp = lists.map(list => (
        <li key={list.id}><Link to={`/lists/${list.id}`}>{list.title}</Link></li>
    ));


    const ownGamesComp = [];
    const wantToPlayComp = [];
    if (smartlists && smartlists.length > 0) {
        smartlists.forEach(g => {
            if (g.own) {
                ownGamesComp.push(<li key={`own-${g.bggId}`}><Link to={`/games/${g.bggId}`}>{g.title}</Link></li>);
            }
            if (g.wantToPlay) {
                wantToPlayComp.push(<li key={`play-${g.bggId}`}><Link to={`/games/${g.bggId}`}>{g.title}</Link></li>)
            }
        });
    }


    return (
        <div className="Profile container col-md-12">
            <Row>
                <h1><span className="display-title">Welcome {currentUser.data.username}</span> <Link className="btn btn-outline-light" to="/users/profile/edit">Edit</Link> </h1>
            </Row>
            {/* TODO Messages or Inbox? */}
            <Row>
                <div className="col-md-5">
                    <Card>
                        <CardTitle>{currentUser.data.name}</CardTitle>
                        <CardSubtitle>{currentUser.data.email}</CardSubtitle>
                        <CardSubtitle><span>Location:</span> {currentUser.data.cityname}, {currentUser.data.state}, {currentUser.data.country}</CardSubtitle>
                        <CardBody>
                            {currentUser.data.bio}
                        </CardBody>
                        <Link className="btn btn-primary" to={`/users/${currentUser.data.id}`}>View Public Profile</Link>
                    </Card>
                </div>

                <div className="col-md-3">
                    <Card>
                        <CardTitle>Games I want to play</CardTitle>
                        <CardBody>
                            <ul>
                                {wantToPlayComp}
                            </ul>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardTitle>Games I Own</CardTitle>
                        <CardBody>
                            <ul>
                                {ownGamesComp}
                            </ul>
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
        </div>
    )
}

export default ProfileView;