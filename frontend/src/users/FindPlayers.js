import React, { useContext, useEffect, useState } from "react";
import BoardGameFinderApi from "../apis/bgfAPI";

import UserContext from "../auth/UserContext";
import LoadingSpinner from "../common/LoadingSpinner";
import { Row } from "reactstrap";
import UserCard from "./UserCard";

/**
 * Find Players Results
 */
function FindPlayers() {
    const [localUsers, setLocalUsers] = useState([]);
    const [stateUsers, setStateUsers] = useState([]);
    const [emptyResults, setEmptyResults] = useState(false);
    const { currentUser } = useContext(UserContext);

    useEffect(() => {
        async function fetchLocalPlayers() {
            try {
                const result = await BoardGameFinderApi.localPlayers(currentUser.data.id);
                if (!result.error) {
                    setLocalUsers(result.users);
                    setEmptyResults(result.users.length === 0);
                } else {
                    console.log(result.error);
                }
            } catch (err) {
                console.error(err);
            }
        }
        setLocalUsers([]);
        setEmptyResults(false);

        fetchLocalPlayers();
    }, [currentUser]);

    useEffect(() => {
        async function fetchStatePlayers() {
            try {
                const result = await BoardGameFinderApi.statePlayers(currentUser.data.id);
                if (!result.error) {
                    setStateUsers(result.users);
                } else {
                    console.log(result.error);
                }
            } catch (err) {
                console.error(err);
            }
        }
        setStateUsers([]);

        fetchStatePlayers();
    }, [currentUser]);

    const spinnerComp = (!localUsers || localUsers.length === 0) && !emptyResults ? <LoadingSpinner /> : <></>;

    const stateUsersComp = stateUsers.map(p => (
        // <li key={p.id}><Link to={`/users/${p.id}`}>{p.username}</Link></li>
        <UserCard key={p.id} user={p} />
    ));

    const localUsersComp = localUsers.map(p => (
        // <li key={p.id}><Link to={`/users/${p.id}`}>{p.username}</Link></li>
        <UserCard key={p.id} user={p} />
    ));

    return (
        <div>
            <h1><span className="display-title">Players in {currentUser.data.cityname}</span> {spinnerComp}</h1>
            <Row className="container">
                {localUsersComp}
                {localUsers.length === 0 && emptyResults ? <h1>No One</h1> : <></>}
            </Row>
            <h1><span className="display-title">Players in {currentUser.data.state}</span> {spinnerComp}</h1>
            <Row className="container">
                {stateUsersComp}
                {stateUsersComp.length === 0 && emptyResults ? <h1>No One</h1> : <></>}
            </Row>
        </div>
    );
}

export default FindPlayers;
