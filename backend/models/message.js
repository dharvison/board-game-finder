"use strict";

const db = require("../db");
const { sqlForPartialUpdate } = require("../helpers/sql");
const { NotFoundError } = require("../expressError");
const User = require("./user");

/** Related functions for games. */

class Message {
    
    /** Send a message with data.
     *
     * Returns { id, fromUser, toUser, date, subject, body }
     *
     * Throws BadRequestError on duplicates.
     **/

    static async send({ fromUser, toUser, subject, body}) {
        const result = await db.query(
            `INSERT INTO messages
           (from_user,
            to_user,
            subject,
            body,
            date)
           VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
           RETURNING id, from_user AS "fromUser", to_user AS "toUser", date, subject, body`,
            [
                fromUser,
                toUser,
                subject,
                body,
            ],
        );

        const msg = result.rows[0];

        return msg;
    }

    /** Find all messages to the given user.
     *
     * Returns [{ id, fromUser, fromUsername, toUser, date, subject }, ...]
     **/

    static async fetchMessages(userId) {
        const result = await db.query(
            `SELECT m.id,
                  m.from_user AS "fromUser",
                  u.username AS "fromUsername",
                  m.to_user AS "toUser",
                  m.date,
                  m.subject
           FROM messages m
            JOIN users u ON m.from_user = u.id
           WHERE m.to_user = $1
           ORDER BY m.id DESC`,
             [userId],
        );

        return result.rows;
    }

    /** Find all messages from the given user.
     *
     * Returns [{ id, fromUser, toUser, date, subject }, ...]
     **/

    static async fetchSentMessages(userId) {
        const result = await db.query(
            `SELECT m.id,
                  m.from_user AS "fromUser",
                  u.username AS "toUsername",
                  m.to_user AS "toUser",
                  m.date,
                  m.subject
           FROM messages m
            JOIN users u ON m.to_user = u.id
           WHERE m.from_user = $1
           ORDER BY m.id`,
             [userId],
        );

        return result.rows;
    }

    /** Given a id, return full message.
     *
     * Returns { id, fromUser, toUser, date, subject, body }
     *
     * Throws NotFoundError if user not found.
     **/

    static async get(msgId) {
        const result = await db.query(
            `SELECT id,
                  from_user AS "fromUser",
                  to_user AS "toUser",
                  date,
                  subject,
                  body
           FROM messages
           WHERE id = $1
           ORDER BY date`,
             [msgId],
        );
        const msg = result.rows[0];

        if (!msg) throw new NotFoundError(`No message: ${msgId}`);

        const fromUser = await User.getById(msg.fromUser);
        const toUser = await User.getById(msg.toUser);
        msg.fromUser = fromUser;
        msg.toUser = toUser;

        return msg;
    }

    /** Delete given message from database; returns undefined. */

    static async remove(msgId) {
        let result = await db.query(
            `DELETE
           FROM games
           WHERE id = $1
           RETURNING id`,
            [msgId],
        );
        const msg = result.rows[0];

        if (!msg) throw new NotFoundError(`No message: ${msgId}`);
    }

    /** Mark Message read or unread */

    // static async toggleRead(msgId) {
    //     // needs field in table to update
    // }
}


module.exports = Message;
