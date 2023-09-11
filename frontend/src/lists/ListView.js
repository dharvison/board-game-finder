import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import BoardGameFinderApi from "../apis/bgfAPI";
import { Card } from "reactstrap";
import ListDetail from "./ListDetail";

/**
 * List View page
 */
function ListView() {
    const { listId } = useParams();
    const [list, setList] = useState(null);

    useEffect(() => {
        const fetchList = async () => {
            try {
                const listData = await BoardGameFinderApi.getList(listId);
                setList(listData);
            } catch (err) {
                console.error(err);
            }
        }
        fetchList();
    }, [listId]);

    if (!list) {
        return (
            <></>
        )
    }

    return (
        <div className="ListDetail container col-md-6">
            <h1 className="display-title">{list.title}</h1>
            <Card>
                <ListDetail list={list} setList={setList} />
                <Link className="btn btn-primary" to={`/lists/${list.id}/add`}>Add Game</Link>
            </Card>
        </div>
    );
}

export default ListView;