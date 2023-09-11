import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardBody, FormGroup, Input, Label } from "reactstrap";

import BoardGameFinderApi from "../apis/bgfAPI";
import moment from "moment";
import LoadingSpinner from "../common/LoadingSpinner";

/**
 * View message
 */
function MessageView() {
    const navigate = useNavigate();
    const { msgId } = useParams();
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const fetchList = async () => {
            try {
                const msgData = await BoardGameFinderApi.getMessage(msgId)
                setMessage(msgData);
            } catch (err) {
                console.error(err);
            }
        }

        fetchList();
    }, [msgId]);

    function replyToMessage(evt) {
        navigate(`/msg/send?toUser=${message.fromUser.id}&username=${message.fromUser.username}&subject=RE:${message.subject}`);
    }

    if (!message) {
        return (<LoadingSpinner />);
    }

    return (
        <div className="Message container col-md-6">
            <Card>
                <CardBody>
                    <form>
                        <FormGroup>
                            <Label htmlFor="fromUser">From</Label>
                            <Input name="fromUser" type="text" value={message.fromUser.username} disabled />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="date">Date</Label>
                            <Input name="date" type="text" value={moment(message.date).fromNow()} disabled />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="subject">Subject</Label>
                            <Input name="subject" type="text" value={message.subject} disabled />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="body">Body</Label>
                            <textarea className="form-control" name="body" rows={5} disabled value={message.body} />
                        </FormGroup>

                        <FormGroup>
                            <Input type="button" className="btn btn-primary" value="Reply" onClick={replyToMessage} />
                        </FormGroup>
                    </form>
                </CardBody>
            </Card>
        </div>
    )
}

export default MessageView;