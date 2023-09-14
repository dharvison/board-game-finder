"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

/** Related functions for users. */

class User {
    /** authenticate user with username, password.
     *
     * Returns { id, username, name, email, bio, country, state, city, isAdmin }
     *
     * Throws UnauthorizedError is user not found or wrong password.
     **/

    static async authenticate(username, password) {
        // try to find the user first
        const result = await db.query(
            `SELECT id,
                  username,
                  password,
                  email,
                  name,
                  bio,
                  country,
                  state,
                  city,
                  cityname,
                  is_admin AS "isAdmin"
           FROM users
           WHERE username = $1`,
            [username],
        );

        const user = result.rows[0];

        if (user) {
            // compare hashed password to a new hash from password
            const isValid = await bcrypt.compare(password, user.password);
            if (isValid === true) {
                delete user.password;
                return user;
            }
        }

        throw new UnauthorizedError("Invalid username/password");
    }

    /** Register user with data.
     *
     * Returns { id, username, name, email, bio, country, city, isAdmin }
     *
     * Throws BadRequestError on duplicates.
     **/

    static async register(
        { username, password, name, email, bio, country, state, city, cityname, isAdmin }) {
        const duplicateCheck = await db.query(
            `SELECT username
           FROM users
           WHERE username = $1`,
            [username],
        );

        if (duplicateCheck.rows[0]) {
            throw new BadRequestError(`Duplicate username: ${username}`);
        }

        const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

        const result = await db.query(
            `INSERT INTO users
           (username,
            password,
            email,
            name,
            bio,
            country,
            state,
            city,
            cityname,
            is_admin)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
           RETURNING id, username, email, name, bio, country, state, city, cityname, is_admin AS "isAdmin"`,
            [
                username,
                hashedPassword,
                email,
                name,
                bio,
                country,
                state,
                city,
                cityname,
                isAdmin,
            ],
        );

        const user = result.rows[0];

        return user;
    }

    /** Find all users.
     *
     * Returns [{ id, username, name, email, bio, country, state, city, isAdmin }, ...]
     **/

    static async findAll() {
        const result = await db.query(
            `SELECT id,
                  username,
                  email,
                  name,
                  bio,
                  country,
                  state,
                  city,
                  cityname,
                  is_admin AS "isAdmin"
           FROM users
           ORDER BY username`,
        );

        return result.rows;
    }

    /** Given a username, return data about user.
     *
     * Returns { id, username, name, email, bio, country, state, city, isAdmin, gamenotes, gamelists, messages }
     *   where gamenotes is { id, ... }
     *   where gamelists is { id, ... }
     *   where messages is { id, ... }
     *
     * Throws NotFoundError if user not found.
     **/

    static async get(username) {
        const userRes = await db.query(
            `SELECT id,
                    username,
                    email,
                    name,
                    bio,
                    country,
                    state,
                    city,
                    cityname,
                    is_admin AS "isAdmin"
            FROM users
            WHERE username = $1`,
            [username],
        );

        const user = userRes.rows[0];

        if (!user) throw new NotFoundError(`No user: ${username}`);

        return user;
    }

    /** Given a userId, return data about user.
     *
     * Returns { id, username, name, email, bio, country, state, city }
     * 
     * if includeSmartLists also includes games
     * [{bggId, title, own, wantToPlay} ...]
     *
     * Throws NotFoundError if user not found.
     **/
    static async getById(userId, includeSmartLists = false) {
        const userRes = await db.query(
            `SELECT id,
                    username,
                    email,
                    name,
                    bio,
                    country,
                    state,
                    city,
                    cityname
            FROM users
            WHERE id = $1`,
            [userId],
        );
        const user = userRes.rows[0];
        if (!user) throw new NotFoundError(`No user: ${userId}`);

        if (includeSmartLists) {
            const listRes = await db.query(
                `SELECT g.bgg_id AS "bggId",
                        g.title,
                        n.own,
                        n.want_to_play AS "wantToPlay"
                FROM gamenotes n
                 JOIN games g ON n.game_id = g.bgg_id
                WHERE n.user_id = $1`,
                [userId],
            );
            user.games = listRes.rows;
        }

        return user;
    }

    /** Given a userId, return user smart lists.
     *
     * Returns {id, games:[{bggId, title, own, wantToPlay} ...]}
     *
     * Throws NotFoundError if user not found.
     **/
    static async getSmartListsByUserId(userId) {
        const userRes = await db.query(
            `SELECT id
            FROM users
            WHERE id = $1`,
            [userId],
        );
        const user = userRes.rows[0];
        if (!user) throw new NotFoundError(`No user: ${userId}`);

        const listRes = await db.query(
            `SELECT g.bgg_id AS "bggId",
                    g.title,
                    n.own,
                    n.want_to_play AS "wantToPlay"
                FROM gamenotes n
                 JOIN games g ON n.game_id = g.bgg_id
                WHERE n.user_id = $1`,
            [userId],
        );
        user.games = listRes.rows;

        return user;
    }

    /** Update user data with `data`.
     *
     * This is a "partial update" --- it's fine if data doesn't contain
     * all the fields; this only changes provided ones.
     *
     * Data can include:
     *   { username, name, email, bio, country, state, city, password, isAdmin }
     *
     * Returns { id, username, name, email, bio, country, state, city, isAdmin }
     *
     * Throws NotFoundError if not found.
     *
     * WARNING: this function can set a new password or make a user an admin.
     * Callers of this function must be certain they have validated inputs to this
     * or a serious security risks are opened.
     */

    static async update(username, data) {
        if (data.password) {
            data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
        }

        const { setCols, values } = sqlForPartialUpdate(
            data,
            {
                isAdmin: "is_admin",
            });
        const usernameVarIdx = "$" + (values.length + 1);

        const querySql = `UPDATE users 
                      SET ${setCols} 
                      WHERE username = ${usernameVarIdx} 
                      RETURNING id,
                                username,
                                name,
                                email,
                                bio,
                                country,
                                state,
                                city,
                                cityname,
                                is_admin AS "isAdmin"`;
        const result = await db.query(querySql, [...values, username]);
        const user = result.rows[0];

        if (!user) throw new NotFoundError(`No user: ${username}`);

        delete user.password;
        return user;
    }

    /** Delete given user from database; returns undefined. */

    static async remove(username) {
        const result = await db.query(
            `DELETE
           FROM users
           WHERE username = $1
           RETURNING username`,
            [username],
        );
        const user = result.rows[0];

        if (!user) throw new NotFoundError(`No user: ${username}`);
    }

    /** Get list of users local to user with userId. */

    static async getLocalUsers(userId) {
        const user = await this.getById(userId);

        const localRes = await db.query(
            `SELECT u.id,
                    u.username,
                    u.name,
                    u.email,
                    u.bio,
                    u.country,
                    u.state,
                    u.city,
                    u.cityname
            FROM users u
            WHERE u.country ILIKE $1 AND u.state ILIKE $2 AND u.city ILIKE $3 AND u.id != $4`,
            [user.country, user.state, user.city, user.id],
        );

        const localUsers = localRes.rows;
        if (localUsers) {
            for (const u of localUsers) {
                u.games = await this.getGamesUserWantsToPlay(u.id);
            }
        }

        return localUsers;
    }

    /** Get list of users local to user with userId. */

    static async getStateUsers(userId) {
        const user = await this.getById(userId);

        const localRes = await db.query(
            `SELECT u.id,
                    u.username,
                    u.name,
                    u.email,
                    u.bio,
                    u.country,
                    u.state,
                    u.city,
                    u.cityname
            FROM users u
            WHERE u.country ILIKE $1 AND u.state ILIKE $2 AND u.id != $3`,
            [user.country, user.state, user.id],
        );

        const localUsers = localRes.rows;
        if (localUsers) {
            for (const u of localUsers) {
                u.games = await this.getGamesUserWantsToPlay(u.id);
            }
        }

        return localUsers;
    }

    /** Get games the user wants to play */

    static async getGamesUserWantsToPlay(userId) {
        const playRes = await db.query(
            `SELECT g.bgg_id AS "bggId",
                    g.title
            FROM gamenotes n JOIN games g
                ON n.game_id = g.bgg_id
            WHERE n.user_id = $1 AND n.want_to_play = true`,
            [userId],
        );
        return playRes.rows;
    }

    /** Get local users to play game */

    static async findlocalGame(userId, bggId) {
        const user = await this.getById(userId);

        const localRes = await db.query(
            `SELECT u.id,
                    u.username,
                    u.country,
                    u.state,
                    u.city,
                    u.cityname
            FROM users u JOIN gamenotes n ON u.id = n.user_id
            WHERE u.country ILIKE $1 AND u.state ILIKE $2 AND u.city ILIKE $3 AND u.id != $4
             AND n.game_id = $5 AND n.want_to_play = true`,
            [user.country, user.state, user.city, user.id, bggId],
        );
        return localRes.rows;
    }

    /** Get state users to play game */

    static async findStateGame(userId, bggId) {
        const user = await this.getById(userId);

        const stateRes = await db.query(
            `SELECT u.id,
                    u.username,
                    u.country,
                    u.state,
                    u.city,
                    u.cityname
            FROM users u JOIN gamenotes n ON u.id = n.user_id
            WHERE u.country ILIKE $1 AND u.state ILIKE $2 AND u.id != $3
             AND n.game_id = $4 AND n.want_to_play = true`,
            [user.country, user.state, user.id, bggId],
        );
        return stateRes.rows;
    }
}


module.exports = User;
