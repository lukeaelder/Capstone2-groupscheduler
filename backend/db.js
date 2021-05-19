"use strict";

const { Pool } = require("pg");
const { getDatabaseUri } = require("./config");

const db = new Pool({
    connectionString: getDatabaseUri()
});

module.exports = db;