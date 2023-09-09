import React, { useContext, useState } from "react";

import { useNavigate } from "react-router-dom";
import { Input, Button } from "reactstrap";
import UserContext from "../auth/UserContext";

/**
 * Search Bar
 */
function SearchBar() {
    const navigate = useNavigate();
    const { setSearchTerm } = useContext(UserContext);
    const [localSearchTerm, setLocalSearchTerm] = useState('');

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        setSearchTerm(localSearchTerm);
        navigate('/search');
    }

    /** Update form data field */
    function handleChange(evt) {
        const { value } = evt.target;
        setLocalSearchTerm(value);
    }

    return (
        <form className="d-none d-md-flex flex-md-grow-1 flex-lg-grow-0 w-50 me-2" role="search" onSubmit={handleSubmit}>
            <Input name="term" value={localSearchTerm} onChange={handleChange}
                type="search" placeholder="Search" aria-label="Search" className="form-control me-1" />
            <Button className="btn btn-light" type="submit">Search</Button>
        </form>
    );
}

export default SearchBar;
