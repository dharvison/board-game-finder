import React, { useEffect, useState } from "react";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";

import './DropdownSelector.css';

function DropdownSelector({ label, data, idField, displayField, setSelected, selectedId }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectLabel, setSelectLabel] = useState(null);

    const toggle = () => setDropdownOpen((prevState) => !prevState);

    function handleClick(evt) {
        const { id, value } = evt.target;
        const newSelection = {};
        newSelection[idField] = id;
        newSelection[displayField] = value;
        setSelected(newSelection);
    }

    useEffect(() => {
        if (data && data.length > 0 && selectedId) {
            const selectedItem = data.find(item => {
                return item[idField] == selectedId;
            });
            if (selectedItem) {
                setSelectLabel(selectedItem[displayField]);
            } else {
                setSelectLabel(label);
            }
        } else {
            setSelectLabel(label);
        }
    }, [data, selectedId]);

    const dataComp = data ? data.map(item => (
        <DropdownItem key={item[idField]} onClick={handleClick} id={item[idField]} value={item[displayField]}>{item[displayField]}</DropdownItem>
    )) : null;

    return (
        <Dropdown isOpen={dropdownOpen} toggle={toggle} disabled={!data || data.length === 0}>
            <DropdownToggle caret>{selectLabel}</DropdownToggle>
            <DropdownMenu className="selector-dropdown">
                {dataComp}
            </DropdownMenu>
        </Dropdown>
    )
}

export default DropdownSelector;
