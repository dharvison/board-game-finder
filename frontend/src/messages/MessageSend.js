import React from "react";
import { Card } from "reactstrap";

import MessageForm from "./MessageForm";

/**
 * Send message form
 */
function MessageSend() {


    return (<>
        <div className="Message container col-md-6">
            <h2 className="display-title">Send Message</h2>
            <Card>
                <MessageForm />
            </Card>
        </div>
    </>)
}

export default MessageSend;