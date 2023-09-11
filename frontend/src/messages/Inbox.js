import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, Table } from "reactstrap";

import BoardGameFinderApi from "../apis/bgfAPI";
import UserContext from "../auth/UserContext";
import moment from "moment";
import LoadingSpinner from "../common/LoadingSpinner";

/**
 * Inbox
 */
function Inbox() {
    const navigate = useNavigate();
    const { currentUser } = useContext(UserContext);
    const [messages, setMessages] = useState(null);

    useEffect(() => {
        const fetchUserMessages = async () => {
            const msgList = await BoardGameFinderApi.getUserMessages(currentUser.data.id);
            setMessages(msgList);
        }
        fetchUserMessages();
    }, [currentUser])

    if (!messages) {
        // TODO show empty inbox message!
        return (<LoadingSpinner />);
    }

    const msgComp = messages.map(m => {
        return (
            <tr key={m.id}>
                <th scope="row">{moment(m.date).fromNow()}</th>
                <td><Link to={`/users/${m.fromUser}`}>{m.fromUsername}</Link></td>
                <td><Link to={`/msg/${m.id}`}>{m.subject}</Link></td>
            </tr>
        );
    });

    return (<div className="Message container col-md-10">
        <h2 className="display-title">Inbox</h2>
        <Card>
            <Table>
                <thead>
                    <tr>
                        <th scope="col">When</th>
                        <th scope="col">From</th>
                        <th scope="col">Subject</th>
                    </tr>
                </thead>
                <tbody>
                    {msgComp}
                </tbody>
            </Table>
        </Card>
    </div>)
}

export default Inbox;