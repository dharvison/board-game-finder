import React from "react";
import { Alert } from "reactstrap";

/**
 * Wrapper for bootstrap Alert
 */
function Alerts({type="danger", messages=[]}) {
    return (
        <Alert color={type}>
            {messages.map(err => (
                <p className="small" key={err}>
                    {err}
                </p>
            ))}
        </Alert>
    )
}

export default Alerts;