const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");

const testUserIds = [];
const testGameIds = [];
const testNoteIds = [];
const testListIds = [];
const testMsgIds = [];

const dummyUser = {
    bio: expect.any(String),
    city: expect.any(String),
    cityname: expect.any(String),
    country: expect.any(String),
    email: expect.any(String),
    name: expect.any(String),
    state: expect.any(String),
    username: expect.any(String),
}

async function commonBeforeAll() {
    // noinspection SqlWithoutWhere
    await db.query("DELETE FROM gamenotes");
    // noinspection SqlWithoutWhere
    await db.query("DELETE FROM gamelists");
    // noinspection SqlWithoutWhere
    await db.query("DELETE FROM games");
    // noinspection SqlWithoutWhere
    await db.query("DELETE FROM messages");
    // noinspection SqlWithoutWhere
    await db.query("DELETE FROM users");

    const userIds = await db.query(`
        INSERT INTO users (username, password, name, bio, email, is_admin, country, state, city, cityname)
        VALUES ('testuser',
                '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
                'Test',
                'User',
                'joel1@joelburton.com',
                FALSE,
                'US',
                'TX',
                '111668',
                'Austin'),
                ('testadmin',
                '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
                'Test',
                'Admin!',
                'joel2@joelburton.com',
                TRUE,
                'US',
                'TX',
                '111668',
                'Austin')
        RETURNING id`);
    userIds.rows.forEach(r => testUserIds.push(r));

    const gameIds = await db.query(`
            INSERT INTO games
            (bgg_id,
            title,
            designer,
            cover_url,
            year)
        VALUES ('1234', 'Test Game', 'Designer', 'CoverURL', '1999'),
               ('1233', 'Test Game 2', 'Designer2', 'CoverURL2', '2002')
        RETURNING bgg_id AS "bggId"
        `);
    gameIds.rows.forEach(r => testGameIds.push(r));

    const noteIds = await db.query(`
            INSERT INTO gamenotes
            (user_id,
            game_id,
            note,
            own,
            want_to_play)
        VALUES ($1, '1234', 'note', true, true),
               ($1, '1233', 'note', false, true)
        RETURNING id`,
        [testUserIds[0].id]);
    noteIds.rows.forEach(r => testNoteIds.push(r));

    const listIds = await db.query(`
            INSERT INTO gamelists
            (user_id,
            title,
            blurb)
        VALUES ($1, 'Sample List', 'blurb'),
               ($1, 'A Second List', 'hello world')
        RETURNING id`,
        [testUserIds[0].id]);
    listIds.rows.forEach(r => testListIds.push(r));

    const msgIds = await db.query(`
            INSERT INTO messages
            (from_user,
                to_user,
            subject,
            body,
            date)
        VALUES ($1, $2, 'Sample Message', 'body text', CURRENT_TIMESTAMP),
               ($2, $1, 'A Response', 'hello world!', CURRENT_TIMESTAMP)
        RETURNING id`,
        [testUserIds[0].id, testUserIds[1].id]);
    msgIds.rows.forEach(r => testMsgIds.push(r));

}

async function commonBeforeEach() {
    await db.query("BEGIN");
}

async function commonAfterEach() {
    await db.query("ROLLBACK");
}

async function commonAfterAll() {
    await db.end();
}


module.exports = {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    testUserIds,
    testGameIds,
    testNoteIds,
    testListIds,
    testMsgIds,
    dummyUser,
};