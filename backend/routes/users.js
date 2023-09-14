"use strict";

/** Routes for users. */

// const jsonschema = require("jsonschema");

const User = require("../models/user");
const { ensureCorrectUserOrAdmin, ensureAdmin, ensureLoggedIn } = require("../middleware/auth");
const express = require("express");
const router = new express.Router();
const { BadRequestError } = require("../expressError");
const Gamenote = require("../models/gamenote");
const Gamelist = require("../models/gamelist");
const Message = require("../models/message");

// POST create for admin only?


/** GET / => { users: [ { id, username, name, email, bio, country, state, city, isAdmin }, ... ] }
 *
 * Returns list of all users.
 *
 * Authorization required: admin
 **/

router.get("/", ensureAdmin, async function (req, res, next) {
    try {
        const users = await User.findAll();
        return res.json({ users });
    } catch (err) {
        return next(err);
    }
});

/** GET /[username] => { user }
 *
 * Returns { id, username, name, email, bio, country, state, city, isAdmin }
 *
 * Authorization required: admin or same user-as-:username
 **/

router.get("/:username", ensureLoggedIn, async function (req, res, next) {
    try {
        const user = await User.get(req.params.username);
        return res.json({ user });
    } catch (err) {
        return next(err);
    }
});

/** PATCH /[username] { user } => { user }
 *
 * Data can include:
 *   { name, email, bio, country, state, city }
 *
 * Returns { id, username, name, email, bio, country, state, city, isAdmin }
 *
 * Authorization required: admin or same-user-as-:username
 **/

router.patch("/:username", ensureLoggedIn, async function (req, res, next) {
    try {
        // const validator = jsonschema.validate(req.body, userUpdateSchema);
        // if (!validator.valid) {
        //     const errs = validator.errors.map(e => e.stack);
        //     throw new BadRequestError(errs);
        // }

        const user = await User.update(req.params.username, req.body);
        return res.json({ user });
    } catch (err) {
        return next(err);
    }
});

/** DELETE /[username]  =>  { deleted: username }
 *
 * Authorization required: admin or same-user-as-:username
 **/

router.delete("/:username", ensureAdmin, async function (req, res, next) {
    try {
        await User.remove(req.params.username);
        return res.json({ deleted: req.params.username });
    } catch (err) {
        return next(err);
    }
});


/** GET /[userId]/public => { user }
 *
 * Returns { id, username, name, email, bio, country, state, city, games }
 *
 * Authorization required: loggedIn
 **/

router.get("/:userId/public", ensureLoggedIn, async function (req, res, next) {
    try {
        const user = await User.getById(req.params.userId, true);
        return res.json({ user });
    } catch (err) {
        return next(err);
    }
});


/** GET /[userId]/smartlists => { smartlists }
 *
 * Returns {id, games:[{bggId, title, own, wantToPlay} ...]}
 *
 * Authorization required: loggedIn
 **/

router.get("/:userId/smartlists", ensureLoggedIn, async function (req, res, next) {
    try {
        const user = await User.getSmartListsByUserId(req.params.userId);
        return res.json({ user });
    } catch (err) {
        return next(err);
    }
});


/** GET /[userId]/notes => { notes list! }
 *
 * Returns [{ id, userId, gameId, note, own, wantToPlay }, ...]
 *
 * Authorization required: loggedIn
 **/

router.get("/:userId/notes", ensureLoggedIn, async function (req, res, next) {
    try {
        const notes = await Gamenote.findUserNotes(req.params.userId);
        return res.json({ notes });
    } catch (err) {
        return next(err);
    }
});

/** GET /[userId]/notes/[bggId] => { notes }
 *
 * Returns { id, userId, gameId, note, own, wantToPlay } if exists
 * or { result: 'none' }
 *
 * Authorization required: loggedIn
 **/

router.get("/:userId/note/:bggId", ensureLoggedIn, async function (req, res, next) {
    try {
        const note = await Gamenote.findUserNoteForGame(req.params.userId, req.params.bggId);

        if (note != null) {
            return res.json({ note });
        } else {
            return res.json({ result: 'none' });
        }

    } catch (err) {
        return next(err);
    }
});

/** GET /[userId]/lists => { list list! }
 *
 * Returns [{ id, userId, title, blurb }, ...]
 *
 * Authorization required: loggedIn
 **/

router.get("/:userId/lists", ensureLoggedIn, async function (req, res, next) {
    try {
        const lists = await Gamelist.findUserLists(req.params.userId);
        return res.json({ lists });
    } catch (err) {
        return next(err);
    }
});

/** GET /[userId]/lists/[gameId] => { list list! }
 *
 * Returns [{ id, userId, title, blurb }, ...]
 *
 * Authorization required: loggedIn
 **/

router.get("/:userId/lists/:gameId", ensureLoggedIn, async function (req, res, next) {
    try {
        const lists = await Gamelist.findUserListsWithGame(req.params.userId, req.params.gameId);
        return res.json({ lists });
    } catch (err) {
        return next(err);
    }
});

/** GET /[userId]/msgs => { messages }
 *
 * Returns [{ id, fromUser, toUser, date, subject }, ...]
 *
 * Authorization required: logged in
 **/

router.get("/:userId/msgs", ensureLoggedIn, async function (req, res, next) {
    try {
        const messages = await Message.fetchMessages(req.params.userId);
        return res.json({ messages });
    } catch (err) {
        return next(err);
    }
});

/** GET /[userId]/sent => { messages }
 *
 * Returns [{ id, fromUser, toUser, date, subject }, ...]
 *
 * Authorization required: logged in
 **/

router.get("/:userId/sent", ensureLoggedIn, async function (req, res, next) {
    try {
        const messages = await Message.fetchSentMessages(req.params.userId);
        return res.json({ messages });
    } catch (err) {
        return next(err);
    }
});

/** GET /[userId]/local => { users }
 *
 * Returns [{ id, username, name, email, bio, country, state, city }, ...]
 *
 * Authorization required: logged in
 **/

router.get("/:userId/local", ensureLoggedIn, async function (req, res, next) {
    try {
        const users = await User.getLocalUsers(req.params.userId);
        return res.json({ users });
    } catch (err) {
        return next(err);
    }
});

/** GET /[userId]/state => { users }
 *
 * Returns [{ id, username, name, email, bio, country, state, city }, ...]
 *
 * Authorization required: logged in
 **/

router.get("/:userId/state", ensureLoggedIn, async function (req, res, next) {
    try {
        const users = await User.getStateUsers(req.params.userId);
        return res.json({ users });
    } catch (err) {
        return next(err);
    }
});


module.exports = router;
