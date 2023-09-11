import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, CardBody, CardSubtitle, CardTitle, Row } from "reactstrap";
import BoardGameFinderApi from "../apis/bgfAPI";
import LoadingSpinner from "../common/LoadingSpinner";


/**
 * Profile Public View
 */
function ProfilePublic() {
    const { userId } = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
        async function fetchUser() {
            try {
                const result = await BoardGameFinderApi.getUserProfile(userId);
                if (result) {
                    setUser(result);
                }
            } catch (err) {
                console.error(err);
            }
        }
        fetchUser();
    }, [userId]);

    if (!user) {
        return (<LoadingSpinner />);
    }

    const ownGamesComp = [];
    const wantToPlayComp = [];
    if (user.games && user.games.length > 0) {
        user.games.forEach(g => {
            if (g.own) {
                ownGamesComp.push(<li key={`own-${g.bggId}`}><Link to={`/games/${g.bggId}`}>{g.title}</Link></li>);
            }
            if (g.wantToPlay) {
                wantToPlayComp.push(<li key={`play-${g.bggId}`}><Link to={`/games/${g.bggId}`}>{g.title}</Link></li>)
            }
        })
    }

    return (
        <div className="Profile container col-md-12">
            <Row>
                <h1>
                    <span className="display-title">{user.username}</span>
                    {' '}
                    <Link className="btn btn-outline-primary" to={`/msg/send?toUser=${user.id}&username=${user.username}&subject=${'lets play!'}`}>Message</Link>
                </h1>
            </Row>
            <Row>
                <div className="col-md-5">
                    <Card>
                        <CardTitle>{user.name}</CardTitle>
                        <CardSubtitle>{user.email}</CardSubtitle>
                        <CardSubtitle><span>Location:</span> {user.city}, {user.country}</CardSubtitle>
                        <CardBody>
                            {user.bio}
                        </CardBody>
                    </Card>
                </div>

                <div className="col-md-3">
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
                        <CardTitle>Games I want to play</CardTitle>
                        <CardBody>
                            <ul>
                                {wantToPlayComp}
                            </ul>
                        </CardBody>
                    </Card>
                </div>
            </Row>
        </div>
    )
}

export default ProfilePublic;