"use strict";

/** Routes for games. */

// const jsonschema = require("jsonschema");

const Game = require("../models/game");
const { ensureLoggedIn, ensureAdmin } = require("../middleware/auth");
const express = require("express");
const router = new express.Router();
const { BadRequestError } = require("../expressError");


/** POST / { game } => { game } 
 * 
 * game should be { bggId, title, designer, coverUrl, year} TODO and external ID!
 * 
 * returns { id, bggId, title, designer, coverUrl, year }
 * 
 * Authorization required: user
 */

router.post("/", ensureLoggedIn, async function (req, res, next) {
    try {
        // validate!

        const game = await Game.create(req.body);
        return res.status(201).json({ game });
    } catch (err) {
        return next(err);
    }
});

/** GET / => { games: [ { id, bggId, title, designer, coverUrl, year } ...] } 
 * 
 * filtering to come!
 * 
 * Authorization required: none
 */

router.get("/", async function (req, res, next) {
    try {
        // create query filter

        const games = await Game.findAll(/* filter to come */);
        return res.json({ games });
    } catch (err) {
        return next(err);
    }
});

/** GET /[gameId] => { game }  
 * 
 * returns { id, bggId, title, designer, coverUrl, year }
 * 
 * Authorization required: none
 */

router.get("/:id", async function (req, res, next) {
    try {
        const game = await Game.get(req.params.id);
        return res.json({ game });
    } catch (err) {
        return next(err);
    }
});

/** PATCH /[gameId] { game } => { game } 
 * 
 * This is a "partial update" --- it's fine if data doesn't contain
 * all the fields; this only changes provided ones.
 *
 * Data can include:
 *   { title, designer, coverUrl, year }
 *  
 * returns { id, bggId, title, designer, coverUrl, year }
 * 
 * Authorization required: user maybe Admin?
 */

router.patch("/:id", ensureLoggedIn, async function (req, res, next) {
    try {
        // validate!

        const game = await Game.update(req.params.id, req.body);
        return res.json({ game });
    } catch (err) {
        return next(err);
    }
});

/** DELETE /[gameId]  =>  { deleted: gameId }
 *
 * Authorization required: admin
 */

router.delete("/:id", ensureAdmin, async function (req, res, next) {
    try {
        await Game.remove(req.params.id);
        return res.json({ deleted: +req.params.id });
    } catch (err) {
        return next(err);
    }
});


module.exports = router;
