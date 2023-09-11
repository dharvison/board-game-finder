"use strict";

/** Routes for messages. */

// const jsonschema = require("jsonschema");

const Message = require("../models/message");
const { ensureLoggedIn, ensureAdmin } = require("../middleware/auth");
const express = require("express");
const router = new express.Router();
const { BadRequestError } = require("../expressError");

/** POST / { msg } => { msg } 
 * 
 * msg should be { fromUser, toUser, date, subject, body }
 * 
 * returns { id, fromUser, toUser, date, subject, body }
 * 
 * Authorization required: user
 */

router.post("/", ensureLoggedIn, async function (req, res, next) {
    try {
        // validate!

        const message = await Message.send(req.body);
        return res.status(201).json({ message });
    } catch (err) {
        return next(err);
    }
});

/** GET /[msgId] => { msg }  
 * 
 * returns { id, fromUser, toUser, date, subject, body }
 * 
 * Authorization required: admin or to/from TODO
 */

router.get("/:id", ensureLoggedIn, async function (req, res, next) {
    try {
        const message = await Message.get(req.params.id);
        return res.json({ message });
    } catch (err) {
        return next(err);
    }
});

/** PATCH /[msgId] { msg } => { msg } 
 * 
 * game should be { title, designer, coverUrl, year} TODO and external ID!
 * 
 * returns { id, fromUser, toUser, date, subject, body }
 * 
 * Authorization required: Admin
 */
// PROBABLY NOT!
// router.patch("/:id", ensureAdmin, async function (req, res, next) {
//     try {
//         // validate!

//         const msg = await Message.update(req.params.id, req.body);
//         return res.json({ msg });
//     } catch (err) {
//         return next(err);
//     }
// });

/** DELETE /[msgId]  =>  { deleted: msgId }
 *
 * Authorization required: admin
 */

router.delete("/:id", ensureAdmin, async function (req, res, next) {
    try {
        await Message.remove(req.params.id);
        return res.json({ deleted: +req.params.id });
    } catch (err) {
        return next(err);
    }
});


module.exports = router;
