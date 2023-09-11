import React, { useContext, useState } from "react";
import UserContext from "../auth/UserContext";
import { ButtonDropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
import BoardGameFinderApi from "../apis/bgfAPI";

/**
 * Add to list comp
 */
function AddToList({ bggId, setCreateAddGameId, addToList }) {
    const { userLists } = useContext(UserContext);
    const [isOpen, setIsOpen] = useState(false);

    function handleClick(evt) {
        const { value } = evt.target;
        const addGameToList = async (listId, gameId) => {
            try {
                const addRes = await BoardGameFinderApi.addGameToList(listId, gameId);
                // TODO handle message and display!
                console.log(addRes);
                if (addToList) {
                    addToList(addRes.list);
                }
            } catch (err) {
                console.log(err);
            }
        }
        addGameToList(value, bggId);
    };

    function handleCreateList(evt) {
        console.log(`add ${bggId} to new list`);
        setCreateAddGameId(bggId);
    };

    function toggle() {
        setIsOpen(!isOpen);
    }

    const listsComp = userLists.map(list => (
        <DropdownItem key={`${bggId}-${list.id}`} value={list.id} onClick={handleClick}>{list.title}</DropdownItem>
    ));
    if (listsComp.length > 0) {
        listsComp.push(<DropdownItem divider key={`${bggId}-divider`} />);
    }

    return (
        <ButtonDropdown isOpen={isOpen} toggle={toggle}>
            <DropdownToggle caret color="primary">
                Add to List
            </DropdownToggle>
            <DropdownMenu>
                {listsComp}
                <DropdownItem onClick={handleCreateList}>Create List</DropdownItem>
            </DropdownMenu>
        </ButtonDropdown>
    )
}

export default AddToList;