import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardBody, FormGroup, Input, Label } from "reactstrap";
import Alerts from "../common/Alerts";

import BoardGameFinderApi from "../apis/bgfAPI";

/**
 * Create/Edit list form
 */
function ListForm() {
    const navigate = useNavigate();

    const initFormData = {
        title: '',
        blurb: '',
    };
    const [formData, setFormData] = useState(initFormData);
    const [formErrors, setFormErrors] = useState([]);

    /** Try to create the list. Success? -> /user/lists/:id */
    const handleSubmit = async (evt) => {
        evt.preventDefault();
        console.log(formData)
        const res = await BoardGameFinderApi.createList(formData);
        console.log(res);
        if (res.success) {
            navigate(`/user/lists/${res.id}`);
        } else {
            setFormErrors(res.errors);
        }
    }

    /** Update form data field */
    function handleChange(evt) {
        const { name, value } = evt.target;
        console.log(name, value)
        setFormData(data => ({
            ...data,
            [name]: value
        }));
    }

    return (
        <div className="ListForm container col-md-6">
            <h2>Create List</h2>
            <Card>
                <CardBody>
                    <form onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label htmlFor="title">Title</Label>
                            <Input name="title" type="text" value={formData.title} onChange={handleChange} required />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="blurb">Blurb</Label>
                            <Input name="blurb" type="text" value={formData.blurb} onChange={handleChange} required />
                        </FormGroup>

                        {formErrors.length > 0 ?
                            <Alerts type="danger" messages={formErrors} /> : null
                        }

                        <FormGroup>
                            <Input type="submit" className="btn btn-secondary" value="Create List" onSubmit={handleSubmit} />
                        </FormGroup>
                    </form>
                </CardBody>
            </Card>
        </div>
    )
}

export default ListForm;