import React, { useContext, useEffect, useState } from "react";
import { FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import Alerts from "../common/Alerts";

import BoardGameFinderApi from "../apis/bgfAPI";
import UserContext from "../auth/UserContext";

/**
 * Create a list and add the game
 */
function CreateAddListPopup({ gameId, setGameId }) {
    const [showModal, setShowModal] = useState(false);
    const { userLists, setUserLists } = useContext(UserContext);

    const initFormData = {
        title: '',
        blurb: '',
    };
    const [formData, setFormData] = useState(initFormData);
    const [formErrors, setFormErrors] = useState([]);

    function hideModal() {
        setFormData(initFormData);
        setFormErrors([]);
        setGameId(null);
    }

    useEffect(() => {
        if (gameId !== null) {
            setShowModal(true);
        } else {
            setShowModal(false);
        }
    }, [gameId])

    // /** Try to create/update the list. Success? -> /user/lists/:id */
    const handleSubmit = async (evt) => {
        evt.preventDefault();
        try {
            const res = await BoardGameFinderApi.createList(formData);
            if (res.success) {
                // update userLists
                userLists.push(res.list)
                setUserLists(userLists);

                const addRes = BoardGameFinderApi.addGameToList(res.list.id, gameId);
                // TODO handle message and display!
                console.log(addRes);
                hideModal();
            } else {
                setFormErrors(res.errors);
            }
        } catch (err) {
            console.error(err);
        }
    }

    /** Update form data field */
    function handleChange(evt) {
        const { name, value } = evt.target;
        setFormData(data => ({
            ...data,
            [name]: value
        }));
    }

    return (<>
        <Modal isOpen={showModal} toggle={hideModal}>
            <ModalHeader toggle={hideModal}>Modal title</ModalHeader>
            <form onSubmit={handleSubmit}>
                <ModalBody>
                    <FormGroup>
                        <Label htmlFor="title">Title</Label>
                        <Input name="title" type="text" value={formData.title} onChange={handleChange} required />
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="blurb">Blurb</Label>
                        {/* <Input name="blurb" type="text" value={formData.blurb} onChange={handleChange} required /> */}
                        <textarea className="form-control" name="blurb" rows={5} onChange={handleChange} required value={formData.blurb} />
                    </FormGroup>

                    {formErrors && formErrors.length > 0 ?
                        <Alerts type="danger" messages={formErrors} /> : null
                    }

                    {/* <FormGroup>
                        <Input type="submit" className="btn btn-secondary" value="Create List" onSubmit={handleSubmit} />
                    </FormGroup> */}
                </ModalBody>
                <ModalFooter>
                    <Input type="submit" className="btn btn-primary" value="Create List" onSubmit={handleSubmit} />
                    <Input type="button" className="btn btn-primary" value="Cancel" onClick={hideModal}/>
                </ModalFooter>
            </form>
        </Modal>
    </>)
}

export default CreateAddListPopup;