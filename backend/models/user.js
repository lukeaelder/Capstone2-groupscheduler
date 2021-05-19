"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { NotFoundError, BadRequestError, UnauthorizedError} = require("../expressError");
const { BCRYPT_WORK_FACTOR } = require("../config.js");

class User {
    static async login(username, password){
        const res = await db.query(
            `SELECT first_name, last_name, username, email, password FROM users WHERE username = $1`,
            [username]
        );
        const user = res.rows[0];
        if (user) {
            const isValid = await bcrypt.compare(password, user.password);
            if (isValid === true){
                delete user.password;
                return user;
            }
        }
        throw new UnauthorizedError("Invalid username/password");
    }

    static async signup({first_name, last_name, username, email, password}){
        const dupCheck = await db.query(
            `SELECT username FROM users WHERE username = $1`, [username]
        );
        if (dupCheck.rows[0]) {
            throw new BadRequestError(`Duplicate username: ${username}`);
        }
        const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
        const result = await db.query(
            `INSERT INTO users (username, first_name, last_name, email, password) VALUES ($1, $2, $3, $4, $5)
                RETURNING username, first_name, last_name, email`,
            [
                username,
                first_name,
                last_name,
                email,
                hashedPassword
            ]
        );
        const user = result.rows[0];
        return user;
    }

    static async get(username){
        const res = await db.query(`SELECT username, first_name, last_name, email FROM users WHERE username = $1`,
            [username]
        );
        const user = res.rows[0];
        if (!user) throw new NotFoundError(`No user: ${username}`);
        return user;
    }
}

module.exports = User;