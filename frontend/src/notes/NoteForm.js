import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardBody, FormGroup, Input, Label } from "reactstrap";
import Alerts from "../common/Alerts";

import BoardGameFinderApi from "../apis/bgfAPI";

/**
 * Create/Edit note form
 */
function NoteForm() {
    const navigate = useNavigate();

    const initFormData = {
        gameId: '',
        note: '',
        own: false,
        wantToPlay: false,
    };
    const [formData, setFormData] = useState(initFormData);
    const [formErrors, setFormErrors] = useState([]);

    /** Try to create the note. Success? -> /user/note/:id */
    const handleSubmit = async (evt) => {
        evt.preventDefault();
        const res = await BoardGameFinderApi.createNote(formData);
        console.log(res);
        if (res.success) {
            navigate(`/user/notes/${res.id}`);
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
        <div className="NoteForm container col-md-6">
            <h2>Create Note</h2>
            <Card>
                <CardBody>
                    <form onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label htmlFor="gameId">gameId</Label>
                            <Input name="gameId" type="text" value={formData.gameId} onChange={handleChange} required />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="note">Note</Label>
                            <Input name="note" type="text" value={formData.note} onChange={handleChange} required />
                        </FormGroup>
                        {/* TODO own and wantToPlay as check box! */}

                        {formErrors.length > 0 ?
                            <Alerts type="danger" messages={formErrors} /> : null
                        }

                        <FormGroup>
                            <Input type="submit" className="btn btn-secondary" value="Create Note" onSubmit={handleSubmit} />
                        </FormGroup>
                    </form>
                </CardBody>
            </Card>
        </div>
    )
}

export default NoteForm;