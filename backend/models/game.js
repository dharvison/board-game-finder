"use strict";

const db = require("../db");
const { fetchGameInfo } = require("../apis/bggXML");
const { sqlForPartialUpdate } = require("../helpers/sql");
const { NotFoundError } = require("../expressError");

/** Related functions for games. */

/** TODO need to connect with API helper to fetch things, etc */

class Game {

    /** Create game with data.
     *
     * Returns { id, bggId, title, designer, coverUrl, year }
     *
     * Throws BadRequestError on duplicates.
     **/

    static async create({ bggId, title, designer, coverUrl, year }) {
        const duplicateCheck = await db.query(
            `SELECT bgg_id
           FROM games
           WHERE bgg_id = $1`,
            [bggId],
        );

        if (duplicateCheck.rows[0]) {
            throw new BadRequestError(`Duplicate game: ${bggId} ${title}`);
        }

        const result = await db.query(
            `INSERT INTO games
           (bgg_id,
            title,
            designer,
            cover_url,
            year)
           VALUES ($1, $2, $3, $4)
           RETURNING id, bgg_id AS "bggId", title, designer, cover_url AS "coverUrl", year`,
            [
                bggId,
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
     * Returns [{ id, bggId, title, designer, coverUrl, year }, ...]
     **/

    static async findAll(/* TODO FILTERING! */) {
        const result = await db.query(
            `SELECT id,
                  bgg_id AS "bggId",
                  title,
                  designer,
                  cover_url AS "coverUrl",
                  year
           FROM games
           ORDER BY title`,
        ); // order by external DB id?

        return result.rows;
    }

    /** Given a bggId, return data about game.
     * 
     * If not present locally, fetch from BGG API
     *
     * Returns { id, bggId, title, designer, coverUrl, year }
     *
     * Throws NotFoundError if game not found.
     **/

    static async get(bggId) {
        const gameRes = await db.query(
            `SELECT id,
                bgg_id AS "bggId",
                title,
                designer,
                cover_url AS "coverUrl",
                year
            FROM games
            WHERE bgg_id = $1`,
            [bggId],
        );
        let game = gameRes.rows[0];

        if (!game) {
            game = this.fetch([bggId]);
            // this.create(game);
        }

        return game;
    }

    /** Fetch games from BGG
     *  
     * bggIds is a list of ids
     * 
     * Returns [{ bggId, title, designer, coverUrl, year } ...]
     */
    static async fetch(bggIds) {
        const fetchedData = await fetchGameInfo(bggIds);
        
        // TODO Store the data when ???
        // TODO include more data on direct fetch? or create another helper

        return fetchedData;
    }

    /** Update game data with `data`.
     *
     * This is a "partial update" --- it's fine if data doesn't contain
     * all the fields; this only changes provided ones.
     *
     * Data can include:
     *   { title, designer, coverUrl, year }
     *
     * Returns { id, bggId, title, designer, coverUrl, year }
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
                                bgg_id AS "bggId",
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
