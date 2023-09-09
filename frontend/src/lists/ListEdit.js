import React, { useEffect, useState } from "react";
import { Card } from "reactstrap";
import ListForm from "./ListForm";
import { useParams } from "react-router-dom";
import BoardGameFinderApi from "../apis/bgfAPI";
import LoadingSpinner from "../common/LoadingSpinner";

/**
 * Edit list
 */
function ListEdit() {
    const { listId } = useParams();
    const [list, setList] = useState(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const fetchList = async () => {
            try {
                const listRes = await BoardGameFinderApi.getList(listId);
                setList(listRes);
            } catch (err) {
                console.error(err);
            }
            setLoaded(true);
        }
        setLoaded(false);
        fetchList();
    }, [listId]);

    if (!loaded) {
        return (<LoadingSpinner />);
    }

    return (
        <div className="ListForm container col-md-6">
            <h1 className="display-title">Edit List</h1>
            <Card>
                <ListForm list={list} />
            </Card>
        </div>
    )
}

export default ListEdit;