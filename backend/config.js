"use strict";

require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY || "secret-key";

const PORT = +process.env.PORT || 5020;

const getDatabaseUri = () => {
    return (process.env.NODE_ENV === "test")
        ? "scheduler_test"
        : process.env.DATABASE_URL || "scheduler";
}

const BCRYPT_WORK_FACTOR = 13;

module.exports = {
    SECRET_KEY,
    PORT,
    BCRYPT_WORK_FACTOR,
    getDatabaseUri
};