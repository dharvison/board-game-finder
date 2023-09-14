import React, { useContext } from "react";
import { Card, CardBody, CardImg, CardText, CardTitle, Row } from "reactstrap";
import UserContext from "../auth/UserContext";
import { Link } from "react-router-dom";

import MagnifyingGlass from '../static/magnifying-glass.png';
import Handtruck from '../static/hand-truck.png';
import Players from '../static/tabletop-players.png';

/**
 * Homepage, it's not that exciting
 */
function BoardGameFinderHome() {
    const { currentUser } = useContext(UserContext);

    return (
        <>
            <Row>
                <div>
                    <h1 className="display-title">{currentUser.loaded ? `Welcome ${currentUser.data.username}!` : (
                        <>
                            Love Board Games? <Link to="/signup" className="btn btn-lg btn-primary">Sign Up</Link> for Board Game Finder!
                        </>
                    )}
                    </h1>
                </div>
            </Row>
            <Row>
                <div className="col-md-4">
                    <Card className="home">
                        <CardImg src={MagnifyingGlass} top />
                        <CardBody className="text-center">
                            <CardTitle>
                                <h1>Browse Games</h1>
                            </CardTitle>
                            <CardText>Check out <Link to="/trending">Trending Games</Link> or search for games you're interested in.</CardText>
                        </CardBody>
                    </Card>
                </div>
                <div className="col-md-4">
                    <Card className="home">
                        <CardImg src={Handtruck} top />
                        <CardBody className="text-center">
                            <CardTitle>
                                <h1>Manage Your Collection</h1>
                            </CardTitle>
                            <CardText>Keep track the games you own and games you want to play.</CardText>
                        </CardBody>
                    </Card>
                </div>
                <div className="col-md-4">
                    <Card className="home">
                    <CardImg src={Players} top />
                        <CardBody className="text-center">
                            <CardTitle>
                                <h1>Find Local Players</h1>
                            </CardTitle>
                            <CardText>See players who are local and are looking to play the same games!</CardText>
                        </CardBody>
                    </Card>
                </div>
            </Row>
        </>
    )
}

export default BoardGameFinderHome;
