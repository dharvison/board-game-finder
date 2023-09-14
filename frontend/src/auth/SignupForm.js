import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardBody, FormGroup, Input, Label } from "reactstrap";
import Alerts from "../common/Alerts";
import LocationApi from "../apis/locationAPI";
import DropdownSelector from "../common/DropdownSelector";

/**
 * Sign up form
 */
function SignupForm({ signup }) {
    const navigate = useNavigate();

    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    const [country, setCountry] = useState(null);
    const [state, setState] = useState(null);
    const [city, setCity] = useState(null);

    const initFormData = {
        username: '',
        password: '',
        email: '',
        name: '',
        bio: '',
        country: '',
        state: '',
        city: '',
        cityname: '',
    };
    const [formData, setFormData] = useState(initFormData);
    const [formErrors, setFormErrors] = useState([]);

    useEffect(() => {
        const fetchCountries = async () => {
            const countryRes = await LocationApi.fetchCountries();
            setCountries(countryRes);
        }
        fetchCountries();
    }, []);

    useEffect(() => {
        const fetchStates = async () => {
            const statesRes = await LocationApi.fetchStates(country);
            setStates(statesRes);
        }
        if (country && country.length === 2) {
            fetchStates();
        }
    }, [country]);

    useEffect(() => {
        const fetchCities = async () => {
            const cityRes = await LocationApi.fetchCities(country, state);
            setCities(cityRes);
        }
        if (state && state.length === 2) {
            fetchCities();
        }
    }, [state]);

    function selectCountry(newCountry) {
        setCountry(newCountry['iso2']);
        handleChange({ target: { name: 'country', value: newCountry['iso2'] } });
    }

    function selectState(newState) {
        setState(newState['iso2']);
        handleChange({ target: { name: 'state', value: newState['iso2'] } });
    }

    function selectCity(newCity) {
        console.log(newCity);
        setCity(newCity['id']);
        handleChange({ target: { name: 'city', value: newCity['id'] } });
        handleChange({ target: { name: 'cityname', value: newCity['name'] } });
    }

    /** Try to create the user. Success? -> / */
    const handleSubmit = async (evt) => {
        evt.preventDefault();
        const res = await signup(formData);
        if (res.success) {
            navigate('/');
        } else {
            setFormErrors(res.errors);
        }
    }

    /** Update form data field */
    function handleChange(evt) {
        const { name, value } = evt.target;
        console.log(name, value);
        setFormData(data => ({
            ...data,
            [name]: value
        }));
    }

    return (
        <div className="SignupForm container col-md-6">
            <span className="display-title">Sign Up</span> <span className="text-sm">or <Link to="/login" className="btn btn-outline-primary mb-1">Log In</Link></span>
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
                            <Label htmlFor="email">Email</Label>
                            <Input name="email" type="text" value={formData.email} onChange={handleChange} required />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="name">Name</Label>
                            <Input name="name" type="text" value={formData.name} onChange={handleChange} required />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="bio">Bio</Label>
                            {/* <Input name="bio" type="text" value={formData.bio} onChange={handleChange} required /> */}
                            <textarea className="form-control" name="bio" rows={5} onChange={handleChange} required value={formData.bio} />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="country">Country</Label>
                            <DropdownSelector label="Country" data={countries} idField="iso2" displayField="name" setSelected={selectCountry} selectedId={country} required />
                            {/* <Input name="country" type="text" value={formData.country} onChange={handleChange} required /> */}
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="state">State</Label>
                            <DropdownSelector label="State" data={states} idField="iso2" displayField="name" setSelected={selectState} selectedId={state} required />
                            {/* <Input name="state" type="text" value={formData.state} onChange={handleChange} required /> */}
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="city">City</Label>
                            <DropdownSelector label="City" data={cities} idField="id" displayField="name" setSelected={selectCity} selectedId={city} required />
                            {/* <Input name="city" type="text" value={formData.city} onChange={handleChange} required /> */}
                        </FormGroup>

                        {formErrors.length > 0 ?
                            <Alerts type="danger" messages={formErrors} /> : null
                        }

                        <FormGroup>
                            <Input type="submit" className="btn btn-primary" value="Sign up" onSubmit={handleSubmit} />
                        </FormGroup>
                    </form>
                </CardBody>
            </Card>


        </div>
    )
}

export default SignupForm;