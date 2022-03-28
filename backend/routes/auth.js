"use strict";

const jsonschema = require("jsonschema");
const express = require("express");
const { faker } = require('@faker-js/faker');
const router = new express.Router();

const User = require("../models/user");
const { createToken } = require("../helpers/tokens");
const userRegisterSchema = require("../schemas/userRegister.json");
const userAuthSchema = require("../schemas/userAuth.json");
const { BadRequestError } = require("../expressError");

router.post("/login", async (req, res, next) => {
    try {
        const validator = jsonschema.validate(req.body, userAuthSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        const { username, password } = req.body;
        const user = await User.login(username, password);
        const token = createToken(user);
        return res.json({ token });
    } catch (err) {
        return next(err);
    }
});

router.post("/signup", async (req, res, next) => {
    try {
        const validator = jsonschema.validate(req.body, userRegisterSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        const newUser = await User.signup({ ...req.body });
        const token = createToken(newUser);
        return res.status(201).json({ token });
    } catch (err) {
        return next(err);
    }
});

router.post('/guestlogin', async (req, res, next) => {
    try {
        const user = faker.finance.account(10)
        console.log(user)
        const newUser = await User.signup({ 
            first_name: "guest",
            last_name: "user",
            username: `guest-${user}`,
            email: `guest-${user}@guestemail.com`,
            password: "Password123" 
        });
        const token = createToken(newUser);
        return res.status(201).json({ token });
    } catch (err) {
        return next(err);
    }
})

module.exports = router;