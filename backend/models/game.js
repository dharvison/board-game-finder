"use strict";

const db = require("../db");
const { fetchGameInfo } = require("../apis/bggXML");
const { sqlForPartialUpdate } = require("../helpers/sql");
const { NotFoundError } = require("../expressError");

const NO_COVER_IMG = "https://cf.geekdo-images.com/zxVVmggfpHJpmnJY9j-k1w__imagepage/img/6AJ0hDAeJlICZkzaeIhZA_fSiAI=/fit-in/900x600/filters:no_upscale():strip_icc()/pic1657689.jpg"

/** Related functions for games. */

class Game {

    /** Create game with data.
     *
     * Returns { bggId, title, designer, coverUrl, year }
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
           VALUES ($1, $2, $3, $4, $5)
           RETURNING bgg_id AS "bggId", title, designer, cover_url AS "coverUrl", year`,
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

    /** Find games stored in DB
     *
     * Returns [{ bggId, title, designer, coverUrl, year }, ...]
     **/

    static async findLocalGames() {
        const result = await db.query(
            `SELECT bgg_id AS "bggId",
                  title,
                  designer,
                  cover_url AS "coverUrl",
                  year
           FROM games
           ORDER BY title`,
        );

        return result.rows;
    }

    /** Given a bggId, return data about game.
     * 
     * If not present locally, fetch from BGG API
     *
     * Returns { bggId, title, designer, coverUrl, year }
     *
     * Throws NotFoundError if game not found.
     **/

    static async get(bggId) {
        const gameRes = await db.query(
            `SELECT bgg_id AS "bggId",
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
            const fetchedGame = await this.fetch([bggId]);
            if (fetchedGame && fetchedGame.length > 0) {
                game = fetchedGame[0];
                // maybe only add on creation of Note or List?
                this.create(game);
            } else {
                return { error: `No game ${bggId}` };
            }
        }

        if (!game.coverUrl) {
            game.coverUrl = NO_COVER_IMG;
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

        // TODO throw exception for missing games!
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
     * Returns { bggId, title, designer, coverUrl, year }
     *
     * Throws NotFoundError if not found.
     */

    static async update(bggId, data) {
        const { setCols, values } = sqlForPartialUpdate(
            data,
            {
                coverUrl: "cover_url",
            });
        const idVarIdx = "$" + (values.length + 1);

        const querySql = `UPDATE games 
                      SET ${setCols} 
                      WHERE bgg_id = ${idVarIdx} 
                      RETURNING bgg_id AS "bggId",
                                title,
                                designer,
                                cover_url AS "coverUrl",
                                year`;
        const result = await db.query(querySql, [...values, bggId]);
        const game = result.rows[0];

        if (!game) throw new NotFoundError(`No game: ${bggId}`);

        return game;
    }

    /** Delete given game from database; returns undefined. */

    static async remove(bggId) {
        let result = await db.query(
            `DELETE
           FROM games
           WHERE bgg_id = $1
           RETURNING bgg_id`,
            [bggId],
        );
        const game = result.rows[0];

        if (!game) throw new NotFoundError(`No game: ${bggId}`);
    }
}


module.exports = Game;
