import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BoardGameFinderApi from "../apis/bgfAPI";
import { Card, CardBody } from "reactstrap";

/**
 * List Detail page
 */
function ListDetail() {
    const { listId } = useParams();
    const [list, setList] = useState(null);

    useEffect(() => {
        const fetchList = async () => {
            try {
                const listData = await BoardGameFinderApi.getList(listId);
                console.log(listData)
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

    // TODO make useful
    return (
        <div className="ListDetail container col-md-6">
            <Card>
                <CardBody>
                    <h2>{list.id}</h2>
                    <h6 className="subtitle">{list.userId}</h6>
                    <h6 className="subtitle">{list.title}</h6>
                    <h6 className="subtitle">{list.blurb}</h6>

                </CardBody>
            </Card>
        </div>
    );
}

export default ListDetail;