"use strict";

/** Routes for trending games */

// const jsonschema = require("jsonschema");

const { hotItems } = require("../apis/bggXML");

const { ensureLoggedIn } = require("../middleware/auth");
const express = require("express");
const router = new express.Router();
const { BadRequestError } = require("../expressError");

router.get("/hot", async function (req, res, next) {
    try {
        const results = await hotItems();
        console.log(results);
        return res.json(results);
    } catch (err) {
        return next(err);
    }
});



module.exports = router;
