import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BoardGameFinderApi from "../apis/bgfAPI";
import { Card, Row } from "reactstrap";
import ListDetail from "./ListDetail";
import SearchBar from "../search/SearchBar";
import LoadingSpinner from "../common/LoadingSpinner";

/**
 * List Add page
 */
function ListAdd() {
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
        return (<LoadingSpinner />);
    }

    return (
        <div className="ListDetail container col-md-12">
            <Row>
                <h1 className="display-title">{list.title}</h1>
            </Row>

            <Row>
                <div className="col-md-4">
                    <Card>
                        <ListDetail list={list} setList={setList} />
                    </Card>
                </div>

                <div className="col-md-8">
                    <Card>
                        <SearchBar />
                    </Card>
                </div>
            </Row>
        </div>
    );
}

export default ListAdd;