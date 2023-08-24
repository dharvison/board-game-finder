"use strict";

const db = require("../db");
const { sqlForPartialUpdate } = require("../helpers/sql");
const { NotFoundError } = require("../expressError");

/** Related functions for gamelists. */

class Gamelist {

    /** Create gamelist with data.
     *
     * Returns { id, userId, title, blurb }
     *
     * Throws BadRequestError on duplicates.
     **/

    static async create({ userId, title, blurb }) {
        const result = await db.query(
            `INSERT INTO gamelists
           (user_id,
            title,
            blurb)
           VALUES ($1, $2, $3)
           RETURNING id, user_id AS "userId", title, blurb`,
            [
                userId,
                title,
                blurb,
            ],
        );
        const gamelist = result.rows[0];

        return gamelist;
    }

    /** Find all gamelists for the given user.
     *
     * Returns [{ id, userId, title, blurb }, ...]
     **/

    static async findAll(userId) {
        const result = await db.query(
            `SELECT id,
                  user_id AS "userId",
                  title,
                  blurb,
           FROM gamelists
           WHERE user_id = $1
           ORDER BY title`,
            [userId],
        );

        return result.rows;
    }

    /** Given a listId, return the list info and games.
     *
     * Returns { id, userId, title, blurb, games }
     *      where games is [{ id, title, designer, coverUrl, year }...]
     *
     * Throws NotFoundError if gamelist not found.
     **/
    // TODO implement!
    static async get(listId) {
        // const userRes = await db.query(
        //     `SELECT username,
        //           first_name AS "firstName",
        //           last_name AS "lastName",
        //           email,
        //           is_admin AS "isAdmin"
        //    FROM users
        //    WHERE username = $1`,
        //     [username],
        // );

        // const user = userRes.rows[0];

        // if (!user) throw new NotFoundError(`No user: ${username}`);

        // const userApplicationsRes = await db.query(
        //     `SELECT a.job_id
        //    FROM applications AS a
        //    WHERE a.username = $1`, [username]);

        // user.applications = userApplicationsRes.rows.map(a => a.job_id);
        // return user;
    }

    /** Update gamelist data with `data`.
     *
     * This is a "partial update" --- it's fine if data doesn't contain
     * all the fields; this only changes provided ones.
     *
     * Data can include:
     *   { title, blurb }
     *
     * Returns { id, userId, title, blurb }
     *
     * Throws NotFoundError if not found.
     */

    static async update(listId, data) {
        const { setCols, values } = sqlForPartialUpdate(
            data,
            {
                userId: "user_id",
            });
        const idVarIdx = "$" + (values.length + 1);

        const querySql = `UPDATE games 
                      SET ${setCols} 
                      WHERE id = ${idVarIdx} 
                      RETURNING id,
                                user_id AS "userId",
                                title,
                                blurb`;
        const result = await db.query(querySql, [...values, listId]);
        const gamelist = result.rows[0];

        if (!gamelist) throw new NotFoundError(`No gamelist: ${listId}`);

        return gamelist;
    }

    /** Delete given game from database; returns undefined. */

    static async remove(listId) {
        let result = await db.query(
            `DELETE
           FROM gamelists
           WHERE id = $1
           RETURNING id`,
            [listId],
        );
        const gamelist = result.rows[0];

        if (!gamelist) throw new NotFoundError(`No gamelist: ${listId}`);
    }

    /** Add game to gamelist; returns updated gamelist games? */

    static async addGame(listId, gameId) {
        // TODO
    }

    /** Remove game from gamelist; returns updated gamelist games? */

    static async removeGame(listId, gameId) {
        // TODO
    }
}


module.exports = Gamelist;
