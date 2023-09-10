"use strict";

/** Routes for gamelists. */

// const jsonschema = require("jsonschema");

const Gamelist = require("../models/gamelist");
const { ensureLoggedIn, ensureAdmin, ensureCorrectUserOrAdmin } = require("../middleware/auth");
const express = require("express");
const router = new express.Router();
const { BadRequestError } = require("../expressError");

router.get("/", async function (req, res, next) {
    try {
        const msg = "list success!"
        return res.json({ msg });
    } catch (err) {
        return next(err);
    }
});

/** POST / { list } => { list } 
 * 
 * list should be { userId, title, blurb }
 * 
 * returns { id, userId, title, blurb }
 * 
 * Authorization required: user
 */

router.post("/", ensureLoggedIn, async function (req, res, next) {
    try {
        // validate!
        req.body.userId = res.locals.user.userId;

        const list = await Gamelist.create(req.body);
        return res.status(201).json({ list });
    } catch (err) {
        return next(err);
    }
});

/** GET /[listId] => { list }  
 * 
 * returns { id, userId, title, blurb, games }
 *      where games is [{ game stuff here TODO }]
 * 
 * Authorization required: none TODO probably user who owns the list, unless public?
 */

router.get("/:id", async function (req, res, next) {
    try {
        const list = await Gamelist.get(req.params.id);
        return res.json({ list });
    } catch (err) {
        return next(err);
    }
});

/** PATCH /[listId] { list } => { list } 
 * 
 * Data can include:
 *   { title, blurb }
 * 
 * returns { id, userId, title, blurb }
 * 
 * Authorization required: admin or owner TODO
 */

router.patch("/:id", ensureLoggedIn, async function (req, res, next) {
    try {
        // validate!

        const list = await Gamelist.update(req.params.id, req.body);
        return res.json({ list });
    } catch (err) {
        return next(err);
    }
});

/** DELETE /[listId]  =>  { deleted: listId }
 *
 * Authorization required: admin or owner TODO
 */

router.delete("/:id", ensureAdmin, async function (req, res, next) {
    try {
        await Gamelist.remove(req.params.id);
        return res.json({ deleted: +req.params.id });
    } catch (err) {
        return next(err);
    }
});



/** POST /[listId]/add { gameId } => { list } 
 * 
 * add game id TODO
 * 
 * returns ???
 * 
 * Authorization required: admin or owner TODO
 */

router.post("/:id/add", ensureLoggedIn, async function (req, res, next) {
    try {
        // validate!
        console.log("add", req.params.id, req.body.gameId);
        const result = await Gamelist.addGame(req.params.id, req.body.gameId);
        return res.json(result);
    } catch (err) {
        return next(err);
    }
});

/** POST /[listId]/remove { gameId } => { list } 
 * 
 * add game id TODO
 * 
 * returns ???
 * 
 * Authorization required: admin or owner TODO
 */

router.post("/:id/remove", ensureLoggedIn, async function (req, res, next) {
    try {
        // validate!
        console.log("add", req.params.id, req.body.gameId);
        const result = await Gamelist.removeGame(req.params.id, req.body.gameId);
        return res.json(result);
    } catch (err) {
        return next(err);
    }
});


module.exports = router;
