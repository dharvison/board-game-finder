import React, { useContext } from "react";
import { Card, CardBody, CardText, CardTitle } from "reactstrap";
import UserContext from "../auth/UserContext";
import { Link } from "react-router-dom";

/**
 * Homepage, it's not that exciting
 */
function BoardGameFinderHome() {
    const { currentUser } = useContext(UserContext);

    return (
        <Card className="home">
            <CardBody className="text-center">
                <CardTitle>
                    <h1>Board Games!</h1>
                </CardTitle>
                <CardText>Everyone loves them!</CardText>

                {currentUser.loaded ? <h3>Welcome {currentUser.data.username}!</h3> : (
                    <>
                        <Link to="/login" className="btn btn-primary mx-1">Login</Link>
                        or
                        <Link to="/signup" className="btn btn-primary mx-1">Sign Up</Link>
                    </>
                )}
            </CardBody>
        </Card>
    )
}

export default BoardGameFinderHome;
