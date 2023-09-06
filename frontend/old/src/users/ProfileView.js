import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardBody, FormGroup, Input, Label } from "reactstrap";
import Alerts from "../common/Alerts";
import BoardGameFinderApi from "../apis/bgfAPI";
import UserContext from "../auth/UserContext";

// TODO!


/**
 * Profile Form
 */
function ProfileForm() {
    const navigate = useNavigate();
    const { currentUser } = useContext(UserContext);

    const initFormData = {
        username: currentUser.data.username,
        password: '',
        email: currentUser.data.email,
        name: currentUser.data.name,
        bio: currentUser.data.bio,
        country: currentUser.data.country,
        city: currentUser.data.city,
    };
    console.log(currentUser);
    const [formData, setFormData] = useState(initFormData);
    const [formErrors, setFormErrors] = useState([]);

    /** Try to update the user. Success? -> / */
    const handleSubmit = async (evt) => {
        evt.preventDefault();
        const res = await BoardGameFinderApi.saveProfile(formData.username, formData);
        if (res.success) {
            navigate('/');
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
            <h2>Edit Profile</h2>
            <Card>
                <CardBody>
                    <form onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label htmlFor="username">Username</Label>
                            <Input name="username" type="text" value={formData.username} onChange={handleChange} required disabled />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="password">Password</Label>
                            <Input name="password" type="password" value={formData.password} onChange={handleChange} required disabled />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="email">Email</Label>
                            <Input name="email" type="text" value={formData.email} onChange={handleChange} required disabled />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="country">Country</Label>
                            <Input name="country" type="text" value={formData.country} onChange={handleChange} required disabled />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="city">City</Label>
                            <Input name="city" type="text" value={formData.city} onChange={handleChange} required disabled />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="name">Name</Label>
                            <Input name="name" type="text" value={formData.name} onChange={handleChange} required disabled />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="bio">Bio</Label> 
                            {/* TODO text area? */}
                            <Input name="bio" type="text" value={formData.bio} onChange={handleChange} required disabled />
                        </FormGroup>

                        {formErrors.length > 0 ?
                            <Alerts type="danger" messages={formErrors} /> : null
                        }

                        <FormGroup>
                            <Input type="submit" className="btn btn-secondary" value="Update Profile" onSubmit={handleSubmit} />
                        </FormGroup>
                    </form>
                </CardBody>
            </Card>


        </div>
    )
}

export default ProfileForm;