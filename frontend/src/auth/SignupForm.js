import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardBody, FormGroup, Input, Label } from "reactstrap";
import Alerts from "../common/Alerts";

/**
 * Sign up form
 */
function SignupForm({ signup }) {
    const navigation = useNavigate();

    const initFormData = {
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        email: '',
    };
    const [formData, setFormData] = useState(initFormData);
    const [formErrors, setFormErrors] = useState([]);

    /** Try to create the user. Success? -> /companies */
    const handleSubmit = async (evt) => {
        evt.preventDefault();
        const res = await signup(formData);
        if (res.success) {
            navigation.push('/companies');
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
        <div className="SignupForm container col-md-6">
            <h2>Sign Up</h2>
            <Card>
                <CardBody>
                    <form onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label htmlFor="username">Username</Label>
                            <Input name="username" type="text" value={formData.username} onChange={handleChange} required />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="password">Password</Label>
                            <Input name="password" type="password" value={formData.password} onChange={handleChange} required />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="firstName">First Name</Label>
                            <Input name="firstName" type="text" value={formData.firstName} onChange={handleChange} required />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input name="lastName" type="text" value={formData.lastName} onChange={handleChange} required />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="email">Email</Label>
                            <Input name="email" type="text" value={formData.email} onChange={handleChange} required />
                        </FormGroup>

                        {formErrors.length > 0 ?
                            <Alerts type="danger" messages={formErrors} /> : null
                        }

                        <FormGroup>
                            <Input type="submit" className="btn btn-secondary" value="Sign up" onSubmit={handleSubmit} />
                        </FormGroup>
                    </form>
                </CardBody>
            </Card>


        </div>
    )
}

export default SignupForm;