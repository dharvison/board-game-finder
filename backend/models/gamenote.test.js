"use strict";

const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require("../expressError");
const db = require("../db.js");
const Gamenote = require("./gamenote.js");
const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    testUserIds,
    testGameIds,
    testNoteIds,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
    test("works", async function () {
        const userId = testUserIds[1];
        const gameId = testGameIds[0];
        const note = await Gamenote.create({ userId: userId.id, gameId: gameId.bggId, note: 'Note', own: true, wantToPlay: true });

        const noteRes = await db.query(`
        SELECT user_id AS "userId", game_id AS "gameId", note, own, want_to_play AS "wantToPlay"
        FROM gamenotes
        WHERE id= $1`, [note.id]);

        expect(noteRes.rows[0]).toEqual({
            gameId: gameId.bggId,
            userId: userId.id,
            note: "Note",
            own: true,
            wantToPlay: true,
        });
    });

    test("fails if non-existant user", async function () {
        const userId = { id: 1 };
        const gameId = testGameIds[0];

        try {
            await Gamenote.create({ userId: userId.id, gameId: gameId.bggId, note: 'Note', own: true, wantToPlay: true });
            fail();
        } catch (err) {
            expect(err).toBeTruthy();
        }
    });
});

/************************************** get */

describe("get", function () {
    test("works", async function () {
        const note = await Gamenote.get(testNoteIds[0].id);

        const noteRes = await db.query(`
        SELECT user_id AS "userId", game_id AS "gameId", note, own, want_to_play AS "wantToPlay"
        FROM gamenotes
        WHERE id= $1`, [testNoteIds[0].id]);

        expect(note).toEqual({
            game: {
                bggId: noteRes.rows[0].gameId,
                title: expect.any(String),
                designer: expect.any(String),
                year: expect.any(Number),
                coverUrl: expect.any(String),
            },
            id: expect.any(Number),
            userId: testUserIds[0].id,
            note: noteRes.rows[0].note,
            own: noteRes.rows[0].own,
            wantToPlay: noteRes.rows[0].wantToPlay,
        });
    });

    test("fails if non-existant note", async function () {
        try {
            const note = await Gamenote.get(1);
            fail();
        } catch (err) {
            expect(err).toBeTruthy();
        }
    });
});

/************************************** update */

describe("update", function () {
    const updateData = {
        note: "NewNote",
        own: true,
        wantToPlay: false,
    };

    test("works", async function () {
        const note = await Gamenote.update(testNoteIds[0].id, updateData);
        expect(note).toEqual({
            id: testNoteIds[0].id,
            gameId: expect.any(Number),
            userId: expect.any(Number),
            ...updateData,
        });
    });

    test("not found if no such note", async function () {
        try {
            await Gamenote.update(1, updateData);
            fail();
        } catch (err) {
            expect(err).toBeTruthy();
        }
    });

    test("bad request if no data", async function () {
        expect.assertions(1);
        try {
            await Gamenote.update(testNoteIds[0].id, {});
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});

/************************************** remove */

describe("remove", function () {
    test("works", async function () {
        await Gamenote.remove(testNoteIds[1].id);
        const res = await db.query(
            "SELECT * FROM gamenotes WHERE id=$1",
            [testNoteIds[1].id]);
        expect(res.rows.length).toEqual(0);
    });

    test("not found if no such note", async function () {
        try {
            await Gamenote.remove(1);
            fail();
        } catch (err) {
            expect(err).toBeTruthy();
        }
    });
});

