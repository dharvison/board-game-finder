"use strict";

const db = require("../db");
const { sqlForPartialUpdate } = require("../helpers/sql");
const { NotFoundError } = require("../expressError");

/** Related functions for games. */

class Message {
    
    /** Send a message with data.
     *
     * Returns { id, fromUser, toUser, date, subject, body }
     *
     * Throws BadRequestError on duplicates.
     **/

    static async send({ fromUser, toUser, date, subject, body}) {
        // TODO maybe set the date on creation!
        const result = await db.query(
            `INSERT INTO messages
           (from_user,
            to_user,
            date,
            subject,
            body)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING id, from_user AS "fromUser", to_user AS "toUser", date, subject, body`,
            [
                fromUser,
                toUser,
                date,
                subject,
                body,
            ],
        );

        const msg = result.rows[0];

        return msg;
    }

    /** Find all messages to the given user.
     *
     * Returns [{ id, fromUser, toUser, date, subject }, ...]
     **/

    static async fetchMessages(userId) {
        const result = await db.query(
            `SELECT id,
                  from_user AS "fromUser",
                  to_user AS "toUser",
                  date,
                  subject
           FROM messages
           WHERE to_user = $1
           ORDER BY date`,
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
            `SELECT id,
                  from_user AS "fromUser",
                  to_user AS "toUser",
                  date,
                  subject
           FROM messages
           WHERE from_user = $1
           ORDER BY date`,
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

    static async toggleRead(msgId) {
        // TODO
        // needs field in table to update
    }
}


module.exports = Message;
