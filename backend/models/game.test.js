"use strict";

const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require("../expressError");
const db = require("../db.js");
const Game = require("./game.js");
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
        const game = await Game.create({
            bggId: 1111,
            title: "New Game",
            designer: "New",
            year: 1998,
            coverUrl: "CoverURLNew",
        })

        const gameRes = await db.query(`
            SELECT bgg_id AS "bggId", title, designer, year, cover_url AS "coverUrl"
            FROM games
            WHERE bgg_id= $1`, [game.bggId]);

        expect(gameRes.rows[0]).toEqual({
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

