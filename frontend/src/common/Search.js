import React, { useState } from "react";
import { Button, Form, Input, InputGroup } from "reactstrap";

/**
 * Generic search component. Calls fireSearch with searchTerm on submit.
 */
function Search({fireSearch}) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleChange = (evt) => {
        const { value } = evt.target;
        setSearchTerm(value);
    }

    const handleSearch = (evt) => {
        evt.preventDefault();
        fireSearch(searchTerm);
    }
    
    return (
        <div className="Search mb-3">
            <Form onSubmit={handleSearch}>
                <InputGroup>
                    <Input name="term" type="text" placeholder="Search" onChange={handleChange}/>
                    <Button color="secondary">Search</Button>
                </InputGroup>
            </Form>
        </div>
    );
}

export default Search;