import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CardBody, FormGroup, Input, Label } from "reactstrap";
import Alerts from "../common/Alerts";

import BoardGameFinderApi from "../apis/bgfAPI";
import UserContext from "../auth/UserContext";

/**
 * Create/Edit list form
 */
function ListForm({ list }) {
    const navigate = useNavigate();
    const { userLists, setUserLists } = useContext(UserContext);

    const initFormData = {
        title: list ? list.title : '',
        blurb: list ? list.blurb : '',
    };
    const [formData, setFormData] = useState(initFormData);
    const [formErrors, setFormErrors] = useState([]);

    /** Try to create/update the list. Success? -> /user/lists/:id */
    const handleSubmit = async (evt) => {
        evt.preventDefault();
        try {
            let res;
            if (list) {
                delete formData.id;
                res = await BoardGameFinderApi.updateList(list.id, formData);
            } else {
                res = await BoardGameFinderApi.createList(formData);
            }
            if (res.success) {
                // update userLists
                if (list) {
                    setUserLists(userLists.map(l => {
                        if (l.id === list.id) {
                            return res.list;
                        } else {
                            return l;
                        }
                    }))
                } else {
                    userLists.push(res.list)
                    setUserLists(userLists);
                }

                navigate(`/lists/${res.list.id}`);
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

    return (<>
        <CardBody>
            <form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label htmlFor="title">Title</Label>
                    <Input name="title" type="text" value={formData.title} onChange={handleChange} required />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="blurb">Blurb</Label>
                    {/* <Input name="blurb" type="text" value={formData.blurb} onChange={handleChange} required /> */}
                    <textarea className="form-control" name="blurb" rows={5} onChange={handleChange} required value={formData.blurb} />
                </FormGroup>

                {formErrors && formErrors.length > 0 ?
                    <Alerts type="danger" messages={formErrors} /> : null
                }

                <FormGroup>
                    <Input type="submit" className="btn btn-primary" value={list ? "Update List" : "Create List"} onSubmit={handleSubmit} />
                </FormGroup>
            </form>
        </CardBody>
    </>)
}

export default ListForm;