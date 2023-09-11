import React, { useContext, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CardBody, FormGroup, Input, Label } from "reactstrap";
import Alerts from "../common/Alerts";

import BoardGameFinderApi from "../apis/bgfAPI";
import UserContext from "../auth/UserContext";

/**
 * Send message form
 */
function MessageForm() {
    const navigate = useNavigate();
    const { currentUser } = useContext(UserContext);
    const [searchParams] = useSearchParams();
    const toUserId = searchParams.get('toUser');
    const toUsername = searchParams.get('username');
    const initSubject = searchParams.get('subject');

    const initFormData = {
        toUser: toUserId ? toUserId : '',
        fromUser: currentUser.data.id,
        subject: initSubject ? initSubject : '',
        body: '',
    };
    const [formData, setFormData] = useState(initFormData);
    const [formErrors, setFormErrors] = useState([]);

    /** Try to send the message */
    const handleSubmit = async (evt) => {
        evt.preventDefault();
        try {
            const res = await BoardGameFinderApi.sendMessage(formData);
            if (res.success) {
                navigate('/inbox'); // TODO show confirmation!
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
                    <Label htmlFor="toUser">To</Label>
                    <Input name="toUser" type="text" value={toUsername} disabled />
                </FormGroup>
                {/* <FormGroup>
                    <Label htmlFor="fromUser">fromUser</Label>
                    <Input name="fromUser" type="text" value={formData.fromUser} onChange={handleChange} required />
                </FormGroup> */}
                <FormGroup>
                    <Label htmlFor="subject">Subject</Label>
                    <Input name="subject" type="text" value={formData.subject} onChange={handleChange} required />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="body">Message Body</Label>
                    <textarea className="form-control" name="body" rows={5} onChange={handleChange} required value={formData.body} />
                </FormGroup>

                {formErrors && formErrors.length > 0 ?
                    <Alerts type="danger" messages={formErrors} /> : null
                }

                <FormGroup>
                    <Input type="submit" className="btn btn-primary" value="Send" onSubmit={handleSubmit} />
                </FormGroup>
            </form>
        </CardBody>
    </>)
}

export default MessageForm;