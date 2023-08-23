"use strict";

const db = require("../db");
const { sqlForPartialUpdate } = require("../helpers/sql");
const { NotFoundError } = require("../expressError");

/** Related functions for games. */

/** TODO need to connect with API helper to fetch things, etc */

class Game {

    /** Create game with data.
     *
     * Returns { id, title, designer, coverUrl, year }
     *
     * Throws BadRequestError on duplicates.
     **/

    static async create({ title, designer, coverUrl, year }) {
        // const duplicateCheck = await db.query(
        //     `SELECT username
        //    FROM users
        //    WHERE username = $1`,
        //     [username],
        // );

        // if (duplicateCheck.rows[0]) {
        //     throw new BadRequestError(`Duplicate username: ${username}`);
        // }

        const result = await db.query(
            `INSERT INTO games
           (title,
            designer,
            cover_url,
            year)
           VALUES ($1, $2, $3, $4)
           RETURNING id, title, designer, cover_url AS "coverUrl", year`,
            [
                title,
                designer,
                coverUrl,
                year
            ],
        );

        const game = result.rows[0];

        return game;
    }

    /** Find all games.
     *
     * Returns [{ id, title, designer, coverUrl, year }, ...]
     **/

    static async findAll(/* TODO FILTERING! */) {
        const result = await db.query(
            `SELECT id,
                  title,
                  designer,
                  cover_url AS "coverUrl",
                  year
           FROM games
           ORDER BY title`,
        ); // order by external DB id?

        return result.rows;
    }

    /** Given a id, return data about game. TODO this likely fetches more info from API
     *
     * Returns { id, title, designer, coverUrl, year }
     *
     * Throws NotFoundError if game not found.
     **/
    // TODO implement!
    static async get(gameId) {
        const gameRes = await db.query(
            `SELECT id,
                title,
                designer,
                cover_url AS "coverUrl",
                year
            FROM games
            WHERE id = $1`,
            [gameId],
        );

        const game = gameRes.rows[0];

        if (!game) throw new NotFoundError(`No game: ${gameId}`);

        // const userApplicationsRes = await db.query(
        //     `SELECT a.job_id
        //    FROM applications AS a
        //    WHERE a.username = $1`, [username]);

        // user.applications = userApplicationsRes.rows.map(a => a.job_id);
        return game;
    }

    /** Update game data with `data`.
     *
     * This is a "partial update" --- it's fine if data doesn't contain
     * all the fields; this only changes provided ones.
     *
     * Data can include:
     *   { title, designer, coverUrl, year }
     *
     * Returns { id, title, designer, coverUrl, year }
     *
     * Throws NotFoundError if not found.
     */

    static async update(gameId, data) {
        const { setCols, values } = sqlForPartialUpdate(
            data,
            {
                coverUrl: "cover_url",
            });
        const idVarIdx = "$" + (values.length + 1);

        const querySql = `UPDATE games 
                      SET ${setCols} 
                      WHERE id = ${idVarIdx} 
                      RETURNING id,
                                title,
                                designer,
                                cover_url AS "coverUrl",
                                year`;
        const result = await db.query(querySql, [...values, gameId]);
        const game = result.rows[0];

        if (!game) throw new NotFoundError(`No game: ${gameId}`);

        return game;
    }

    /** Delete given game from database; returns undefined. */

    static async remove(gameId) {
        let result = await db.query(
            `DELETE
           FROM games
           WHERE id = $1
           RETURNING id`,
            [gameId],
        );
        const game = result.rows[0];

        if (!game) throw new NotFoundError(`No game: ${gameId}`);
    }
}


module.exports = Game;
