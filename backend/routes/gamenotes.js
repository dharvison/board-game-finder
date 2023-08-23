"use strict";

/** Routes for gamenotes. */

// const jsonschema = require("jsonschema");

const Gamenote = require("../models/gamenote");
const { ensureLoggedIn, ensureAdmin } = require("../middleware/auth");
const express = require("express");
const router = new express.Router();
const { BadRequestError } = require("../expressError");


/** POST / { note } => { note } 
 * 
 * note should be { userId, gameId, note, own, wantToPlay } TODO external ID?
 * 
 * returns { id, userId, gameId, note, own, wantToPlay }
 * 
 * Authorization required: user
 */

router.post("/", ensureLoggedIn, async function (req, res, next) {
    try {
        // validate!

        const note = await Gamenote.create(req.body);
        return res.status(201).json({ note });
    } catch (err) {
        return next(err);
    }
});

/** GET /[noteId] => { note }  
 * 
 * returns { id, userId, gameId, note, own, wantToPlay }
 * 
 * Authorization required: none TODO probably user who owns the note, unless public?
 */

router.get("/:id", async function (req, res, next) {
    try {
        const note = await Gamenote.get(req.params.id);
        return res.json({ note });
    } catch (err) {
        return next(err);
    }
});

/** PATCH /[noteId] { note } => { note } 
 * 
 * Data can include:
 *   { note, own, wantToPlay }
 * 
 * returns { id, userId, gameId, note, own, wantToPlay }
 * 
 * Authorization required: admin or owner TODO
 */

router.patch("/:id", ensureLoggedIn, async function (req, res, next) {
    try {
        // validate!

        const note = await Gamenote.update(req.params.id, req.body);
        return res.json({ game });
    } catch (err) {
        return next(err);
    }
});

/** DELETE /[noteId]  =>  { deleted: noteId }
 *
 * Authorization required: admin or owner TODO
 */

router.delete("/:id", ensureAdmin, async function (req, res, next) {
    try {
        await Gamenote.remove(req.params.id);
        return res.json({ deleted: +req.params.id });
    } catch (err) {
        return next(err);
    }
});


module.exports = router;
