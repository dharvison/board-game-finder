"use strict";

const db = require("../db");
const { sqlForPartialUpdate } = require("../helpers/sql");
const { NotFoundError } = require("../expressError");

/** Related functions for games. */

class Gamenote {

    /** Create game with data.
     *
     * Returns { id, userId, gameId, note, own, wantToPlay }
     *
     * Throws BadRequestError on duplicates.
     **/

    static async create({ userId, gameId, note, own, wantToPlay }) {
        const duplicateCheck = await db.query(
            `SELECT id
            FROM gamenotes
            WHERE user_id = $1 AND game_id = $2`,
            [userId,
                gameId],
        );

        if (duplicateCheck.rows[0]) {
            throw new BadRequestError(`User ${userId}already has note from this game ${gameId}!`);
        }

        const result = await db.query(
            `INSERT INTO gamenotes
           (user_id,
            game_id,
            note,
            own,
            want_to_play)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING id, user_id AS "userId", game_id AS "gameId", note, own, want_to_play AS "wantToPlay"`,
            [
                userId,
                gameId,
                note,
                own,
                wantToPlay,
            ],
        );

        const noteRes = result.rows[0];

        return note;
    }

    /** Find all note for given user.
     *
     * Returns [{ id, userId, gameId, note, own, wantToPlay }, ...]
     **/

    static async findUserNotes(userId) {
        // TODO this should probably get the game's title at least!
        const result = await db.query(
            `SELECT id,
                user_id AS "userId",
                game_id AS "gameId",
                note,
                own,
                want_to_play AS "wantToPlay"
           FROM gamenotes
           ORDER BY id`,
        );

        return result.rows;
    }

    /** Given a noteId, return note joined with game info
     *
     * Returns { id, userId, note, own, wantToPlay, game }
     *      where game is { id, title, designer, coverUrl, year }
     *
     * Throws NotFoundError if gamenote not found.
     **/

    static async get(noteId) {
        const existRes = await db.query(
            `SELECT id
            FROM gamenotes
            WHERE id = $1`,
            [noteId],
        );
        const exists = existRes.rows[0];
        if (!exists) throw new NotFoundError(`No note: ${noteId}`);

        // TODO this is probably wrong
        const noteRes = await db.query(
            `SELECT n.id,
                n.user_id AS "userId",
                n.game_id AS "gameId",
                n.note,
                n.own,
                n.want_to_play AS "wantToPlay"
                g.title,
                g.designer,
                g.cover_url AS "cover_url",
                g.year
           FROM gamenotes n
            JOIN games g
            ON n.game_id = g.id
           WHERE n.id = $1`,
            [noteId],
        );
        const note = noteRes.rows[0];

        if (!note) throw new NotFoundError(`No note: ${noteId}`);
        // TODO verify
        return {
            id: note.id,
            userId: note.userId,
            note: note.note,
            own: note.own,
            wantToPlay: note.wantToPlay,
            game: {
                id: note.gameId,
                title: note.title,
                designer: note.designer,
                coverUrl: note.coverUrl,
                year: note.year,
            },
        }
    }

    /** Update gamenote data with `data`.
     *
     * This is a "partial update" --- it's fine if data doesn't contain
     * all the fields; this only changes provided ones.
     *
     * Data can include:
     *   { note, own, wantToPlay }
     *
     * Returns { id, userId, gameId, note, own, wantToPlay }
     *
     * Throws NotFoundError if not found.
     */

    static async update(noteId, data) {
        // TODO need this to only update { note, own, wantToPlay }
        const { setCols, values } = sqlForPartialUpdate(
            data,
            {
                wantToPlay: "want_to_play",
            });
        const idVarIdx = "$" + (values.length + 1);

        const querySql = `UPDATE gamenotes 
                      SET ${setCols} 
                      WHERE id = ${idVarIdx} 
                      RETURNING id,
                        user_id AS "userId",
                        game_id AS "gameId",
                        note,
                        own,
                        want_to_play AS "wantToPlay"`;
        const result = await db.query(querySql, [...values, noteId]);
        const game = result.rows[0];

        if (!game) throw new NotFoundError(`No game: ${noteId}`);

        return game;
    }

    /** Delete given gamenote from database; returns undefined. */

    static async remove(noteId) {
        let result = await db.query(
            `DELETE
           FROM gamenotes
           WHERE id = $1
           RETURNING id`,
            [noteId],
        );
        const note = result.rows[0];

        if (!note) throw new NotFoundError(`No note: ${noteId}`);
    }
}


module.exports = Gamenote;
