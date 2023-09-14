import React, { useContext, useEffect, useState } from "react";
import BoardGameFinderApi from "../apis/bgfAPI";

import UserContext from "../auth/UserContext";
import LoadingSpinner from "../common/LoadingSpinner";
import { Row } from "reactstrap";
import { useParams } from "react-router-dom";
import UserCard from "../users/UserCard";

/**
 * Find Players Results
 */
function FindGamePlayers({ bggId, locale }) {

    const [localeUsers, setLocaleUsers] = useState([]);
    const [emptyResults, setEmptyResults] = useState(false);
    const { currentUser } = useContext(UserContext);

    useEffect(() => {
        async function fetchLocalePlayers() {
            try {
                let result;
                if (locale === 'local') {
                    result = await BoardGameFinderApi.localPlayersForGame(currentUser.data.id, bggId);
                } else if (locale === 'state') {
                    result = await BoardGameFinderApi.statePlayersForGame(currentUser.data.id, bggId);
                }
                if (!result.error) {
                    setLocaleUsers(result.users);
                    setEmptyResults(result.users.length === 0);
                } else {
                    console.log(result.error);
                }
            } catch (err) {
                console.error(err);
            }
        }
        setLocaleUsers([]);
        setEmptyResults(false);

        fetchLocalePlayers();
    }, [bggId, locale, currentUser]);

    const spinnerComp = (!localeUsers || localeUsers.length === 0) && !emptyResults ? <LoadingSpinner /> : <></>;

    const localeUsersComp = localeUsers.map(p => (
        <UserCard key={p.id} user={p} small="true" />
    ));

    return (
        <div>
            <h1><span className="display-title">Players in {locale === 'local' ? currentUser.data.cityname : currentUser.data.state}</span> {spinnerComp}</h1>
            <Row className="container">
                {localeUsersComp}
                {localeUsers.length === 0 && emptyResults ? <h1>No One</h1> : <></>}
            </Row>
        </div>
    );
}

export default FindGamePlayers;
