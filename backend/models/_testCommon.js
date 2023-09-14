const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");

const testJobIds = [];

async function commonBeforeAll() {
    // noinspection SqlWithoutWhere
    await db.query("DELETE FROM games");
    // noinspection SqlWithoutWhere
    await db.query("DELETE FROM users");

    await db.query(`
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
                'Austin');`);
    // testJobIds.splice(0, 0, ...resultsJobs.rows.map(r => r.id));

    await db.query(`
            INSERT INTO games
            (bgg_id,
            title,
            designer,
            cover_url,
            year)
        VALUES ('1234', 'Test Game', 'Designer', 'CoverURL', '1999'),
               ('1233', 'Test Game 2', 'Designer2', 'CoverURL2', '2002')
        `);

    // await db.query(`
    //     INSERT INTO applications(username, job_id)
    //     VALUES ('u1', $1)`,
    //     [testJobIds[0]]);
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
    // testJobIds,
};