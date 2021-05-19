"use strict";

const jsonschema = require("jsonschema");
const express = require("express");
const router = new express.Router();

const Groups = require("../models/groups");
const { authenticateJWT, ensureCorrectUser } = require("../middleware/auth");

router.post("/new", authenticateJWT, async function (req, res, next) {
    try {
      const {title, description, username} = req.body;
      const group = await Groups.createGroup(title, description, username);
      return res.json({ group });
    } catch (err) {
      return next(err);
    }
});

router.get("/:username/all", authenticateJWT, ensureCorrectUser, async function (req, res, next) {
  try {
    const groups = await Groups.getall(req.params.username);
    return res.json({ groups });
  } catch (err) {
    return next(err);
  }
})

router.post("/get/:id", authenticateJWT, async function (req, res, next) {
    try {
      const group = await Groups.get(req.params.id, req.body.username);
      return res.json({ group });
    } catch (err) {
      return next(err);
    }
});

router.post("/leave/:id", authenticateJWT, async function(req, res, next){
  try {
    const result = await Groups.leave(req.params.id, req.body.username);
    return res.json({result});
  } catch (err) {
    return next(err);
  }
});

router.post('/add/:id', authenticateJWT, async function(req, res, next){
  try {
    const result = await Groups.add(req.body);
    return res.json({result});
  } catch (err) {
    return next(err);
  }
});

router.post('/announcement/add', authenticateJWT, async function(req, res, next){
  try {
    const result = await Groups.addAnnouncement(req.body);
    return res.json({result});
  } catch (err) {
    return next(err);
  }
});

router.post('/announcement/remove', authenticateJWT, async function(req, res, next){
  try {
    const result = await Groups.removeAnnouncement(req.body);
    return res.json({result});
  } catch (err) {
    return next(err);
  }
});

router.post('/todo/add', authenticateJWT, async function(req, res, next){
  try {
    const result = await Groups.addTodo(req.body);
    return res.json({result});
  } catch (err) {
    return next(err);
  }
});

router.post('/todo/update', authenticateJWT, async function(req, res, next){
  try {
    const result = await Groups.updateTodo(req.body);
    return res.json({result});
  } catch (err) {
    return next(err);
  }
});

module.exports = router;