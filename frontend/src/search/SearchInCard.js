import React, { useState } from "react";
import { Link } from "react-router-dom";
import BoardGameFinderApi from "../apis/bgfAPI";
import { Button, CardBody, CardText, CardTitle, Input, Row } from "reactstrap";
import LoadingSpinner from "../common/LoadingSpinner";
import GameCard from "../games/GameCard";

/**
 * Search for Game to add card
 */
function SearchInCard({ list, addToList }) {

    const [localSearchTerm, setLocalSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [emptyResults, setEmptyResults] = useState(false);

    const handleSubmit = async (evt) => {
        evt.preventDefault();

        if (localSearchTerm != null && localSearchTerm.length > 0) {
            setLoading(true);
            setResults([]);
            try {
                const searchRes = await BoardGameFinderApi.search(localSearchTerm);
                if (!searchRes.error) {
                    setResults(searchRes);
                } else {
                    if (searchRes.error === "No games!") {
                        setEmptyResults(true);
                    }
                }
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        }
    }

    /** Update form data field */
    function handleChange(evt) {
        const { value } = evt.target;
        setLocalSearchTerm(value);
    }

    async function addGame(bggId) {
        console.log(`add game ${bggId} to list ${list.id}`);
        try {
            const addRes = await BoardGameFinderApi.addGameToList(list.id, bggId);
            if (addRes.success) {
                addToList(addRes.game);
            }
            
        } catch (err) {
            console.error(err);
        }
        // update the UI, method passed from parent?
    }

    const spinnerComp = loading ? <LoadingSpinner /> : <></>;

    const resultsComp = results.map(result => {
        return (
            <li key={result.bggId} className="my-1">
                <Link to={`/games/${result.bggId}`}>{result.title}</Link>
                {' '}
                <Button color="primary" size="sm" outline onClick={() => addGame(result.bggId)}>Add to List</Button>
            </li>
        )
    });

    return (
        <CardBody>
            <Row>
                <form className="d-none d-md-flex flex-md-grow-1 flex-lg-grow-0 me-2" role="search" onSubmit={handleSubmit}>
                    <Input name="term" value={localSearchTerm} onChange={handleChange}
                        type="search" placeholder="Search" aria-label="Search" className="form-control me-1" />
                    <Button color="primary" className="btn btn-primary" type="submit">Search</Button>
                </form>
            </Row>
            <Row className="mt-2">
                {spinnerComp}
                <ul>
                    {resultsComp}
                </ul>
            </Row>

        </CardBody>
    );
}

export default SearchInCard;