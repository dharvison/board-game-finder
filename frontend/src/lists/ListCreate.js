import React from "react";
import { Card } from "reactstrap";
import ListForm from "./ListForm";

/**
 * Create list
 */
function ListCreate() {

    return (
        <div className="ListForm container col-md-6">
            <h1 className="display-title">Create List</h1>
            <Card>
                <ListForm />
            </Card>
        </div>
    )
}

export default ListCreate;