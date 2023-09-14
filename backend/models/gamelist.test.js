"use strict";

const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require("../expressError");
const db = require("../db.js");
const Gamelist = require("./gamelist.js");
const Game = require("./game.js");
const User = require("./user.js");
const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create game", function () {
    test("works", async function () {
        const game = await db.query(`
            INSERT INTO games
            (bgg_id,
            title,
            designer,
            cover_url,
            year)
        VALUES ('1111', 'New Game', 'New', 'CoverURLNew', '1998')
        RETURNING bgg_id AS "bggId", title, designer, year, cover_url AS "coverUrl"`);

        expect(game.rows[0]).toEqual({
            bggId: 1111,
            title: "New Game",
            designer: "New",
            year: 1998,
            coverUrl: "CoverURLNew",
        });
    });
});

/************************************** get */

describe("get", function () {
    test("works", async function () {
        let game = await Game.get("1234");
        expect(game).toEqual({
            bggId: 1234,
            title: "Test Game",
            designer: "Designer",
            year: 1999,
            coverUrl: "CoverURL",
        });
    });
});

