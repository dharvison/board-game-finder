import React, { useContext, useEffect, useState } from "react";
import BoardGameFinderApi from "../apis/bgfAPI";

import UserContext from "../auth/UserContext";
import LoadingSpinner from "../common/LoadingSpinner";
import { Card, CardBody, Row } from "reactstrap";
import { Link } from "react-router-dom";

/**
 * Find Players Results
 */
function FindPlayers() {
    const [results, setResults] = useState([]);
    const [emptyResults, setEmptyResults] = useState(false);
    const { currentUser } = useContext(UserContext);

    useEffect(() => {
        async function fetchLocalPlayers() {
            try {
                const result = await BoardGameFinderApi.localPlayers(currentUser.data.id);
                if (!result.error) {
                    setResults(result.users);
                    setEmptyResults(result.users.length === 0);
                } else {
                    console.log(result.error);
                }
            } catch (err) {
                console.error(err);
            }
        }
        setResults([]);
        setEmptyResults(false);

        fetchLocalPlayers();
    }, [currentUser]);

    const spinnerComp = (!results || results.length === 0) && !emptyResults ? <LoadingSpinner /> : <></>;

    const resultsComp = results.map(p => (
        <li key={p.id}><Link to={`/users/${p.id}`}>{p.username}</Link></li>
    ));

    const emptyComp = results.length === 0 ? <h1>No One</h1> : <></>;

    return (
        <div>
            <h1><span className="display-title">Local players for {currentUser.data.username}</span> {spinnerComp}</h1>
            <Row className="container">
                <Card>
                    <CardBody>
                        <ul>
                            {resultsComp}
                        </ul>
                        {emptyComp}
                    </CardBody>
                </Card>
            </Row>
        </div>
    );
}

export default FindPlayers;
