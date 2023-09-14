"use strict";

const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require("../expressError");
const db = require("../db.js");
const Gamelist = require("./gamelist.js");
const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    testUserIds,
    testListIds,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
    test("works", async function () {
        const userId = testUserIds[1];
        const list = await Gamelist.create({ userId: userId.id, title: 'Test Title', blurb: 'Lets play some games!'});

        const listRes = await db.query(`
        SELECT user_id AS "userId", title, blurb
        FROM gamelists
        WHERE id= $1`, [list.id]);

        expect(listRes.rows[0]).toEqual({
            userId: userId.id,
            title: 'Test Title',
            blurb: 'Lets play some games!',
        });
    });

    test("fails if non-existant user", async function () {
        const userId = { id: 1 };

        try {
            await Gamelist.create({ userId: userId.id, title: 'Test Title', blurb: 'Lets play some games!'});
            fail();
        } catch (err) {
            expect(err).toBeTruthy();
        }
    });
});

/************************************** get */

describe("get", function () {
    test("works", async function () {
        const list = await Gamelist.get(testListIds[0].id);

        const listRes = await db.query(`
        SELECT user_id AS "userId", title, blurb
        FROM gamelists
        WHERE id= $1`, [list.id]);


        expect(list).toEqual({
            games: expect.any(Array),
            id: expect.any(Number),
            userId: testUserIds[0].id,
            title: listRes.rows[0].title,
            blurb: listRes.rows[0].blurb,
        });
    });

    test("fails if non-existant note", async function () {
        try {
            await Gamelist.get(1);
            fail();
        } catch (err) {
            expect(err).toBeTruthy();
        }
    });
});

/************************************** update */

describe("update", function () {
    const updateData = {
        title: "Next Level Title",
        blurb: "blurb is mid",
    };

    test("works", async function () {
        const list = await Gamelist.update(testListIds[0].id, updateData);
        expect(list).toEqual({
            id: testListIds[0].id,
            userId: expect.any(Number),
            ...updateData,
        });
    });

    test("not found if no such list", async function () {
        try {
            await Gamelist.update(1, updateData);
            fail();
        } catch (err) {
            expect(err).toBeTruthy();
        }
    });

    test("bad request if no data", async function () {
        expect.assertions(1);
        try {
            await Gamelist.update(testListIds[0].id, {});
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});

/************************************** remove */

describe("remove", function () {
    test("works", async function () {
        await Gamelist.remove(testListIds[1].id);
        const res = await db.query(
            "SELECT * FROM gamelists WHERE id=$1",
            [testListIds[1].id]);
        expect(res.rows.length).toEqual(0);
    });

    test("not found if no such list", async function () {
        try {
            await Gamelist.remove(1);
            fail();
        } catch (err) {
            expect(err).toBeTruthy();
        }
    });
});

