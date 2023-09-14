import React, { useEffect, useState } from "react";
import { UncontrolledAlert } from "reactstrap";

function AlertDisplay({ alertQueue, setAlertQueue }) {
    const [localAlerts, setLocalAlerts] = useState([]);

    useEffect(() => {
        setLocalAlerts([{ message: ['hello'], type: 'danger' }]);

    }, [alertQueue, setAlertQueue]);


    if (localAlerts.length < 1) {
        return <></>
    }

    const alertComp = localAlerts.map(alert => (
        <UncontrolledAlert color={alert.type}>
            {alert.message}
        </UncontrolledAlert>
    ));

    return (
        <div className="AlertDisplay mb-1">
            {alertComp}
        </div>
    )
}

export default AlertDisplay;