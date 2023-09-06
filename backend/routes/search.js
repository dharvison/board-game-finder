"use strict";

/** Routes for search. */

// const jsonschema = require("jsonschema");

const { performSearch } = require("../apis/bggXML");

const { ensureLoggedIn } = require("../middleware/auth");
const express = require("express");
const router = new express.Router();
const { BadRequestError } = require("../expressError");

router.get("/:query", async function (req, res, next) {
    try {
        // TODO make smarter
        // do something smart with the query to search locally and BGG?
        // grab thumbnails in aggregate call with all bggIds returned?
        console.log(req.params.query)
        const results = await performSearch(req.params.query);
        console.log(results)
        return res.json(results);
    } catch (err) {
        return next(err);
    }
});


module.exports = router;
