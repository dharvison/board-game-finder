import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, Table } from "reactstrap";

import BoardGameFinderApi from "../apis/bgfAPI";
import UserContext from "../auth/UserContext";
import moment from "moment";
import LoadingSpinner from "../common/LoadingSpinner";
import TruncateSpan from "../common/TruncateSpan";

/**
 * Inbox
 */
function Inbox() {
    const { currentUser } = useContext(UserContext);
    const [messages, setMessages] = useState(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const fetchUserMessages = async () => {
            const msgList = await BoardGameFinderApi.getUserMessages(currentUser.data.id);
            setMessages(msgList);
            setLoaded(true);
        }
        setLoaded(false);
        fetchUserMessages();
    }, [currentUser])

    const loadingComp = loaded ? (messages && messages.length > 0 ? '': <h3 className="no-messages mt-1">No Messages!</h3>) : <LoadingSpinner />;

    const msgComp = messages && messages.map(m => {
        return (
            <tr key={m.id} className="d-flex">
                <th scope="row" className="col-2">{moment(m.date).fromNow()}</th>
                <td className="col-2"><Link to={`/users/${m.fromUser}`}>{m.fromUsername}</Link></td>
                <td className="col-3"><Link to={`/msg/${m.id}`}><TruncateSpan text={m.subject} length={30} /></Link></td>
                <td className="col-5"><Link to={`/msg/${m.id}`} className="text-secondary"><TruncateSpan text={m.body} length={50} /></Link></td>
            </tr>
        );
    });

    return (<div className="Inbox container col-md-10">
        <h2 className="display-title">Inbox</h2>
        <Card>
            <Table>
                <thead>
                    <tr class="d-flex">
                        <th scope="col" className="col-2">When</th>
                        <th scope="col" className="col-2">From</th>
                        <th scope="col" className="col-3">Subject</th>
                        <th scope="col" className="col-5">Message</th>
                    </tr>
                </thead>
                <tbody>
                    {loadingComp}
                    {msgComp}
                </tbody>
            </Table>
        </Card>
    </div>)
}

export default Inbox;