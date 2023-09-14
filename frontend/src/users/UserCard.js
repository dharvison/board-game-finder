import React from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, CardTitle, CardSubtitle } from "reactstrap";

/**
 * User Card
 */
function UserCard({ user }) {

    return (
        <div className="col-xl-4 col-md-6">
            <Card>
                <CardTitle><Link to={`/users/${user.id}`}>{user.username}</Link></CardTitle>
                <CardSubtitle>{user.name}</CardSubtitle>
                <CardSubtitle>{user.email}</CardSubtitle>
                <CardSubtitle><span>Location:</span> {user.cityname}, {user.state}, {user.country}</CardSubtitle>
                <CardBody>
                    {user.bio}
                </CardBody>
                <Link className="btn btn-outline-primary" to={`/msg/send?toUser=${user.id}&username=${user.username}&subject=${'lets play!'}`}>Message</Link>
            </Card>
        </div>
    );
}

export default UserCard;
