"use strict";

const db = require("../db");
const { sqlForPartialUpdate } = require("../helpers/sql");
const { NotFoundError } = require("../expressError");
const Game = require("./game");

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

    static async findUserLists(userId) {
        const result = await db.query(
            `SELECT id,
                  user_id AS "userId",
                  title,
                  blurb
           FROM gamelists
           WHERE user_id = $1
           ORDER BY title`,
            [userId],
        );

        return result.rows;
    }

    /** Find all gamelists for the given user with game in it.
     *
     * Returns [{ id, userId, title }, ...]
     **/

    static async findUserListsWithGame(userId, gameId) {
        const result = await db.query(
            `SELECT l.id,
                      l.user_id AS "userId",
                      l.title
               FROM gamelists l
               JOIN gamelist_games g ON l.id = g.gamelist_id
               WHERE l.user_id = $1 AND g.game_id = $2
               ORDER BY l.title`,
            [userId, gameId],
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

    static async get(listId) {
        const listRes = await db.query(
            `SELECT l.id,
                  l.user_id AS "userId",
                  l.title,
                  l.blurb
           FROM gamelists l
           WHERE l.id = $1`,
            [listId],
        );
        const list = listRes.rows[0];

        if (!list) throw new NotFoundError(`No list: ${listId}`);

        const gamesRes = await db.query(
            `SELECT g.bgg_id AS "bggId",
                    g.title,
                    g.designer,
                    g.year,
                    g.cover_url AS "coverUrl"
           FROM gamelists l
             JOIN gamelist_games gl ON l.id = gl.gamelist_id
             JOIN games g ON g.bgg_id = gl.game_id
           WHERE l.id = $1`, [listId]);

        list.games = gamesRes.rows;
        return list;
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

        const querySql = `UPDATE gamelists 
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
        const listRes = await db.query(
            `SELECT l.id,
                  l.user_id AS "userId",
                  l.title
           FROM gamelists l
           WHERE l.id = $1`,
            [listId],
        );
        const list = listRes.rows[0];
        if (!list) throw new NotFoundError(`No list: ${listId}`);

        const game = await Game.get(gameId);
        if (!game) throw new NotFoundError(`No game: ${gameId}`);

        const gamesInListRes = await db.query(
            `SELECT gl.game_id AS "gameId"
           FROM gamelists l
             JOIN gamelist_games gl ON l.id = gl.gamelist_id
           WHERE l.id = $1
             AND gl.game_id = $2`,
            [listId, gameId]);
        if (gamesInListRes.rows[0]) {
            return { error: 'Game already in list!' };
        } else {
            const result = await db.query(
                `INSERT INTO gamelist_games
               (gamelist_id,
                game_id)
               VALUES ($1, $2)
               RETURNING gamelist_id AS "gameListId",
                         game_id AS "gameId"`,
                [
                    listId,
                    gameId,
                ],
            );
            if (result.rows[0]) {
                return { success: 'Added to list', game, list };
            } else {
                return { error: 'Failed to add to list' };
            }
        }
    }

    /** Remove game from gamelist; returns updated gamelist games? */

    static async removeGame(listId, gameId) {
        const listRes = await db.query(
            `SELECT l.id,
                  l.user_id AS "userId"
           FROM gamelists l
           WHERE l.id = $1`,
            [listId],
        );
        const list = listRes.rows[0];
        if (!list) throw new NotFoundError(`No list: ${listId}`);

        const game = await Game.get(gameId);
        if (!game) throw new NotFoundError(`No game: ${gameId}`);

        const gamesInListRes = await db.query(
            `SELECT gl.game_id AS "gameId"
           FROM gamelists l
             JOIN gamelist_games gl ON l.id = gl.gamelist_id
           WHERE l.id = $1
             AND gl.game_id = $2`,
            [listId, gameId]);
        if (gamesInListRes.rows[0]) {
            // console.log("GAME IN LIST!")
            const delRes = await db.query(
                `DELETE
               FROM gamelist_games
               WHERE gamelist_id = $1 AND game_id = $2
               RETURNING gamelist_id`,
                [listId, gameId],
            );

            const gamelist = delRes.rows[0];
            if (gamelist) {
                return { success: 'Removed from list' };
            }
        }
        return { error: 'Failed to remove' };
    }
}


module.exports = Gamelist;
