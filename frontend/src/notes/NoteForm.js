import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CardBody, CardTitle, FormGroup, Input, Label } from "reactstrap";
import Alerts from "../common/Alerts";

import BoardGameFinderApi from "../apis/bgfAPI";

/**
 * Create/Edit note form
 */
function NoteForm({ bggId, note }) {
    const navigate = useNavigate();

    const initFormData = {
        gameId: bggId,
        note: note ? note.note : '',
        own: note ? note.own : false,
        wantToPlay: note ? note.wantToPlay : false,
    };

    const [formData, setFormData] = useState(initFormData);
    const [formErrors, setFormErrors] = useState([]);

    /** Try to create/update the note. Success? -> /games/:bggId */
    const handleSubmit = async (evt) => {
        evt.preventDefault();
        try {
            let res;
            if (note) {
                delete formData.gameId;
                res = await BoardGameFinderApi.updateNote(note.id, formData)
            } else {
                res = await BoardGameFinderApi.createNote(formData);
            }
    
            if (res.success) {
                navigate(`/games/${bggId}`);
            } else {
                setFormErrors(res.errors);
            }
        } catch (err) {
            console.error(err);
        }
    }

    /** Update form data field */
    function handleChange(evt) {
        const { name, value } = evt.target;
        setFormData(data => ({
            ...data,
            [name]: value
        }));
    }

    function handleCheck(evt) {
        const { name } = evt.target;
        // Toggle!
        setFormData(data => ({
            ...data,
            [name]: !formData[name]
        }));
    }

    return (<>
        <CardTitle>{note ? "Edit Note" : "Create Note"}</CardTitle>
        <CardBody>
            <form onSubmit={handleSubmit}>
                <FormGroup check>
                    <Input type="checkbox" name="own" onChange={handleCheck} checked={formData.own} />
                    <Label htmlFor="own" check>
                        I own this game.
                    </Label>
                </FormGroup>
                <FormGroup check>
                    <Input type="checkbox" name="wantToPlay" onChange={handleCheck} checked={formData.wantToPlay} />
                    <Label htmlFor="wantToPlay" check>
                        I want to play this game.
                    </Label>
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="note">Note</Label>
                    {/* <Input name="note" type="text" value={formData.note} onChange={handleChange} required /> */}
                    <textarea className="form-control" name="note" rows={5} onChange={handleChange} required value={formData.note} />
                </FormGroup>
                {/* TODO own and wantToPlay as check box! */}

                {formErrors && formErrors.length > 0 ?
                    <Alerts type="danger" messages={formErrors} /> : null
                }

                <FormGroup>
                    <Input type="submit" className="btn btn-primary" value={note ? "Update Note" : "Create Note"} onSubmit={handleSubmit} />
                </FormGroup>
            </form>
        </CardBody>
    </>)
}

export default NoteForm;