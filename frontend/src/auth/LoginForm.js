import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardBody, FormGroup, Input, Label } from "reactstrap";
import Alerts from "../common/Alerts";

/**
 * Login form
 */
function LoginForm({ login }) {
    const navigate = useNavigate();

    const initFormData = {
        username: '',
        password: '',
    };
    const [formData, setFormData] = useState(initFormData);
    const [formErrors, setFormErrors] = useState([]);

    /** Try to create the user. Success? -> /companies */
    const handleSubmit = async (evt) => {
        evt.preventDefault();
        const res = await login(formData);
        if (res.success) {
            navigate('/companies');
        } else {
            setFormErrors(res.errors);
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

    return (
        <div className="LoginForm container col-md-6">
            <h2>Login</h2>
            <Card>
                <CardBody>
                    <form onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label htmlFor="username">Username</Label>
                            <Input name="username" type="text" value={formData.username} onChange={handleChange} required />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="password">password</Label>
                            <Input name="password" type="password" value={formData.password} onChange={handleChange} required />
                        </FormGroup>

                        {formErrors.length > 0 ?
                            <Alerts type="danger" messages={formErrors} /> : null
                        }

                        <FormGroup>
                            <Input type="submit" className="btn btn-secondary" value="Login" onSubmit={handleSubmit} />
                        </FormGroup>
                    </form>
                </CardBody>
            </Card>
        </div>
    )
}

export default LoginForm;