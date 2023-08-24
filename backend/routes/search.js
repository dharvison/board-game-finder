"use strict";

/** Routes for search. */

// const jsonschema = require("jsonschema");

const { performSearch } = require("../apis/bggXML");

const { ensureLoggedIn } = require("../middleware/auth");
const express = require("express");
const router = new express.Router();
const { BadRequestError } = require("../expressError");

router.get("/:term", async function (req, res, next) {
    try {
        const results = await performSearch(req.params.term);
        console.log(results);
        return res.json(results);
    } catch (err) {
        return next(err);
    }
});


module.exports = router;
