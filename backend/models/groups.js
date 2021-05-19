"use strict";

const db = require("../db");
const shortid = require("shortid");
const { NotFoundError, BadRequestError, UnauthorizedError} = require("../expressError");

class Groups {

    static async createGroup(title, description, username){
        const group_id = await shortid.generate();
        const result = await db.query(
            `INSERT INTO groups (id, title, description) VALUES ($1, $2, $3)
                RETURNING id`,
            [
                group_id,
                title,
                description
            ]
        );
        await db.query(`INSERT INTO groups_users (group_id, username, role) VALUES ($1, $2, $3)`,
            [group_id, username, 'Owner']
        );
        const group = result.rows[0];
        return group;
    }

    static async get(group_id, username){
        const userCheck = await db.query(`SELECT username FROM groups_users WHERE username = $1 AND group_id = $2`,
            [username, group_id]
        );
        const user = userCheck.rows[0];
        if (!user) throw new UnauthorizedError(`No group found or you're not in this group`);
        const res = await db.query(`SELECT title, description FROM groups a WHERE id = $1`,
            [group_id]
        );
        const usersres = await db.query(`SELECT a.username, a.image_url, b.role FROM users AS a FULL JOIN groups_users AS b On a.username = b.username WHERE a.username = b.username AND b.group_id = $1`,
            [group_id]
        );
        const announcements = await db.query(`SELECT id, body, username FROM groups_announcements WHERE group_id = $1`,
            [group_id]
        );
        const todos = await db.query(`SELECT id, todo, level FROM groups_todos WHERE group_id = $1 ORDER BY level`,
            [group_id]
        );
        const todosres = todos.rows;
        const announcementsres = announcements.rows;
        const users = usersres.rows;
        const group = res.rows[0];
        if (!group) throw new NotFoundError(`No group found or you're not in this group`);
        return {group, users, announcementsres, todosres};
    }

    static async leave(group_id, username){
        const res = await db.query(`DELETE FROM groups_users WHERE group_id = $1 AND username = $2 RETURNING group_id`,
            [group_id, username]
        )
        const result = res.rows[0];
        return result;
    }

    static async getall(username){
        const res = await db.query(`SELECT a.id, a.title, a.description FROM groups a where a.id in(SELECT b.group_id FROM groups_users b WHERE b.username = $1)`,
            [username]
        );
        const groups = res.rows;
        return groups;
    }

    static async add(data){
        const userCheck = await db.query(`SELECT username FROM users WHERE username = $1`,
            [data.username]
        );
        const userCheckRes = userCheck.rows[0];
        if (!userCheckRes) throw new NotFoundError(`No user found by that username`);
        const userCheck2 = await db.query(`SELECT group_id FROM groups_users WHERE group_id = $1 AND username = $2`,
            [data.group_id, data.self_username]
        );
        const userCheck2Res = userCheck2.rows[0];
        if (!userCheck2Res) throw new UnauthorizedError(`You are unable to add users to this group`);
        const userCheck3 = await db.query(`SELECT username FROM groups_users WHERE group_id = $1 AND username = $2`,
            [data.group_id, data.username]
        );
        const userCheck3Res = userCheck3.rows[0];
        if (userCheck3Res) throw new BadRequestError(`User has already been added to group`);
        const res = await db.query(`INSERT INTO groups_users (group_id, username, role) VALUES ($1, $2, $3) RETURNING group_id`,
            [data.group_id, data.username, data.role]
        );
        return res.rows[0];
    }

    static async addAnnouncement(data){
        const res = await db.query(`INSERT INTO groups_announcements (group_id, username, body) VALUES ($1, $2, $3) RETURNING group_id`,
            [data.group_id, data.username, data.announcement]
        );
        return res.rows[0];
    }

    static async addTodo(data){
        const res = await db.query(`INSERT INTO groups_todos (group_id, todo) VALUES ($1, $2) RETURNING group_id`,
            [data.group_id, data.todo]
        );
        return res.rows[0];
    }

    static async updateTodo(data){
        const res = await db.query(`UPDATE groups_todos SET level = $1 WHERE id = $2 RETURNING id`,
            [data.level, data.id]
        );
        return res.rows;
    }

    static async removeAnnouncement(data){
        const userCheck = await db.query(`SELECT id FROM groups_announcements WHERE id = $1 AND username = $2`,
            [data.id, data.username]
        );
        const userCheckRes = userCheck.rows[0];
        if (!userCheckRes) throw new UnauthorizedError(`You are unable to remove this announcement`);
        const res = await db.query(`DELETE FROM groups_announcements WHERE id= $1 RETURNING id`,
            [data.id]
        );
        return res.rows[0];
    }
}

module.exports = Groups;