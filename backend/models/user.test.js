"use strict";

const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require("../expressError");
const db = require("../db.js");
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

/************************************** authenticate */

describe("authenticate", function () {
    test("works", async function () {
        const user = await User.authenticate("testuser", "password");
        expect(user).toEqual({
            id: expect.any(Number),
            username: "testuser",
            name: "Test",
            bio: "User",
            email: "joel1@joelburton.com",
            isAdmin: false,
            country: "US",
            state: "TX",
            city: "111668",
            cityname: "Austin",
        });
    });

    test("unauth if no such user", async function () {
        try {
            await User.authenticate("nope", "password");
            fail();
        } catch (err) {
            expect(err instanceof UnauthorizedError).toBeTruthy();
        }
    });

    test("unauth if wrong password", async function () {
        try {
            await User.authenticate("testuser", "wrong");
            fail();
        } catch (err) {
            expect(err instanceof UnauthorizedError).toBeTruthy();
        }
    });
});

/************************************** register */

describe("register", function () {
    const newUser = {
        username: "new",
        name: "New User",
        bio: "Tester",
        email: "test@test.com",
        isAdmin: false,
        country: "US",
        state: "TX",
        city: "111668",
        cityname: "Austin",
    };

    test("works", async function () {
        let user = await User.register({
            ...newUser,
            password: "password",
        });
        expect(user).toEqual({
            ...newUser,
            id: expect.any(Number),
        });
        const found = await db.query("SELECT * FROM users WHERE username = 'new'");
        expect(found.rows.length).toEqual(1);
        expect(found.rows[0].is_admin).toEqual(false);
        expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
    });

    test("works: adds admin", async function () {
        let user = await User.register({
            ...newUser,
            password: "password",
            isAdmin: true,
        });
        expect(user).toEqual({ ...newUser, id: expect.any(Number), isAdmin: true });
        const found = await db.query("SELECT * FROM users WHERE username = 'new'");
        expect(found.rows.length).toEqual(1);
        expect(found.rows[0].is_admin).toEqual(true);
        expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
    });

    test("bad request with dup data", async function () {
        try {
            await User.register({
                ...newUser,
                password: "password",
            });
            await User.register({
                ...newUser,
                password: "password",
            });
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});

/************************************** get */

describe("get", function () {
    test("works", async function () {
        let user = await User.get("testuser");
        expect(user).toEqual({
            id: expect.any(Number),
            username: "testuser",
            name: "Test",
            bio: "User",
            email: "joel1@joelburton.com",
            isAdmin: false,
            country: "US",
            state: "TX",
            city: "111668",
            cityname: "Austin",
        });
    });

    test("not found if no such user", async function () {
        try {
            await User.get("nope");
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});

/************************************** getById */

describe("getById", function () {
    test("works", async function () {
        let user = await User.get("testuser");

        let userById = await User.getById(user.id);
        expect(userById).toEqual({
            id: expect.any(Number),
            username: "testuser",
            name: "Test",
            bio: "User",
            email: "joel1@joelburton.com",
            country: "US",
            state: "TX",
            city: "111668",
            cityname: "Austin",
        });
    });

    test("not found if no such user", async function () {
        try {
            await User.getById(100000);
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});

/************************************** update */

describe("update", function () {
    const updateData = {
        name: "NewF",
        bio: "NewF",
        email: "new@email.com",
    };

    test("works", async function () {
        let user = await User.update("testuser", updateData);
        expect(user).toEqual({
            id: expect.any(Number),
            username: "testuser",
            country: "US",
            state: "TX",
            city: "111668",
            cityname: "Austin",
            isAdmin: false,
            ...updateData,
        });
    });

    test("works: set password", async function () {
        let user = await User.update("testuser", {
            password: "new",
        });
        expect(user).toEqual({
            id: expect.any(Number),
            username: "testuser",
            name: "Test",
            bio: "User",
            email: "joel1@joelburton.com",
            isAdmin: false,
            city: "111668",
            cityname: "Austin",
            country: "US",
            state: "TX",
        });
        const found = await db.query("SELECT * FROM users WHERE username = 'testuser'");
        expect(found.rows.length).toEqual(1);
        expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
    });

    test("not found if no such user", async function () {
        try {
            await User.update("nope", {
                firstName: "test",
            });
            fail();
        } catch (err) {
            expect(err).toBeTruthy();
        }
    });

    test("bad request if no data", async function () {
        expect.assertions(1);
        try {
            await User.update("c1", {});
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});

/************************************** remove */

describe("remove", function () {
    test("works", async function () {
        await User.remove("testuser");
        const res = await db.query(
            "SELECT * FROM users WHERE username='testuser'");
        expect(res.rows.length).toEqual(0);
    });

    test("not found if no such user", async function () {
        try {
            await User.remove("nope");
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});

