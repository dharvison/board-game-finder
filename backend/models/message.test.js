"use strict";

const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require("../expressError");
const db = require("../db.js");
const Gamelist = require("./gamelist.js");
const Message = require("./message.js");
const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    testUserIds,
    testListIds,
    testMsgIds,
    dummyUser,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** send */

describe("send", function () {
    test("works", async function () {
        const [userId1, userId2] = testUserIds;
        const msg = await Message.send({ fromUser: userId1.id, toUser: userId2.id, subject: 'Gaming tonight?', body: 'Lets play some games!'});

        const msgRes = await db.query(`
        SELECT from_user AS "fromUser", to_user AS "toUser", subject, body
        FROM messages
        WHERE id= $1`, [msg.id]);

        expect(msgRes.rows[0]).toEqual({
            fromUser: userId1.id,
            toUser: userId2.id,
            subject: 'Gaming tonight?',
            body: 'Lets play some games!',
        });
    });

    test("fails if non-existant user", async function () {
        const userId1 = { id: 1 };

        try {
            await Message.send({ fromUser: userId1.id, toUser: userId1.id, subject: 'Fail', body: 'nothing'});
            fail();
        } catch (err) {
            expect(err).toBeTruthy();
        }
    });
});

/************************************** get */

describe("get", function () {
    test("works", async function () {
        const msg = await Message.get(testMsgIds[0].id);

        const msgRes = await db.query(`
        SELECT from_user AS "fromUser", to_user AS "toUser", subject, body, date
        FROM messages
        WHERE id= $1`, [msg.id]);

        expect(msg).toEqual({
            id: expect.any(Number),
            fromUser: {
                ...dummyUser,
                id: testUserIds[0].id
            },
            toUser: {
                ...dummyUser,
                id: testUserIds[1].id
            },
            subject: msgRes.rows[0].subject,
            body: msgRes.rows[0].body,
            date: expect.any(Date),
        });
    });

    test("fails if non-existant Message", async function () {
        try {
            await Message.get(1);
            fail();
        } catch (err) {
            expect(err).toBeTruthy();
        }
    });
});

/************************************** remove */

describe("remove", function () {
    test("works", async function () {
        await Message.remove(testMsgIds[1].id);
        const res = await db.query(
            "SELECT * FROM messages WHERE id=$1",
            [testMsgIds[1].id]);
        expect(res.rows.length).toEqual(0);
    });

    test("not found if no such message", async function () {
        try {
            await Message.remove(1);
            fail();
        } catch (err) {
            expect(err).toBeTruthy();
        }
    });
});

