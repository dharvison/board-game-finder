import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BoardGameFinderApi from "../apis/bgfAPI";
import { Card, Row } from "reactstrap";
import ListDetail from "./ListDetail";
import LoadingSpinner from "../common/LoadingSpinner";
import SearchInCard from "../search/SearchInCard";

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

    async function addToList(game) {
        try {
            const games = list.games.map(g => (g));
            games.push(game);

            setList({
                id: list.id,
                title: list.title,
                blurb: list.blurb,
                games: games,
            });
        } catch (err) {
            console.error(err);
        }
    }


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
                        <SearchInCard list={list} addToList={addToList} />
                    </Card>
                </div>
            </Row>
        </div>
    );
}

export default ListAdd;