import React from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, CardTitle, CardSubtitle, CardText } from "reactstrap";

/**
 * User Card
 */
function UserCard({ user, small }) {

    const gamesComp = user.games ? user.games.map(g => (
        <li key={`${user.id}-${g.bggId}`}><Link to={`/games/${g.bggId}`}>{g.title}</Link></li>
    )) : <></>;

    return (
        <div className={small ? "col-md-6" : "col-xl-4 col-md-6"}>
            <Card>
                <CardTitle><Link to={`/users/${user.id}`}>{user.username}</Link></CardTitle>
                <CardSubtitle>{user.name}</CardSubtitle>
                <CardSubtitle>{user.email}</CardSubtitle>
                <CardSubtitle><span>Location:</span> {user.cityname}, {user.state}, {user.country}</CardSubtitle>
                <CardBody>
                    <CardText>
                        {user.bio}
                    </CardText>

                    {!small ? (
                        <div className="mt-2">
                            <h5>Wants to Play</h5>
                            {user.games && user.games.length > 0 ?
                                <ul>
                                    {gamesComp}
                                </ul>
                                :
                                <CardText>
                                    Nothing 😢
                                </CardText>
                            }
                        </div>
                    ) : <></>}
                </CardBody>
                <Link className="btn btn-outline-primary" to={`/msg/send?toUser=${user.id}&username=${user.username}&subject=${'lets play!'}`}>Message</Link>
            </Card>
        </div>
    );
}

export default UserCard;
