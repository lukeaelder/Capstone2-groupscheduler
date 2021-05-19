CREATE TABLE users (
    username TEXT PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    image_url TEXT
);

CREATE TABLE groups (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL
);

CREATE TABLE groups_users (
    group_id TEXT REFERENCES groups,
    username TEXT REFERENCES users,
    role TEXT
);

CREATE TABLE groups_announcements (
    id SERIAL PRIMARY KEY,
    group_id TEXT REFERENCES groups,
    username TEXT REFERENCES users,
    body TEXT
);

CREATE TABLE groups_todos (
    id SERIAL PRIMARY KEY,
    group_id TEXT REFERENCES groups,
    todo TEXT,
    level INT DEFAULT 0
);