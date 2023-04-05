const express = require('express');
const router = express.Router();
const data = require('../data');
const commentData = data.comments;
const projectData = data.projects;
const taskData = data.tasks;
const subtaskData = data.subtasks;
const validation = require('../validation');

router.get('/projects/:commentId', async (req, res) => {
    try {
        req.params.commentId = validation.checkId(req.params.commentId);
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const comment = await commentData.getCommentInProject(req.params.commentId);
        return res.status(200).json(comment);
    } catch (e) {
        return res.status(404).json({error: e});
    }
});

router.get('/tasks/:commentId', async (req, res) => {
    try {
        req.params.commentId = validation.checkId(req.params.commentId);
        req.query.taskId = validation.checkId(req.query.taskId);
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const comment = await commentData.getCommentInTask(req.query.taskId, req.params.commentId);
        return res.status(200).json(comment);
    } catch (e) {
        return res.status(404).json({error: e});
    }
});

router.get('/subtasks/:commentId', async (req, res) => {
    try {
        req.params.commentId = validation.checkId(req.params.commentId);
        req.query.taskId = validation.checkId(req.query.taskId);
        req.query.subtaskId = validation.checkId(req.query.subtaskId);
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const comment = await commentData.getCommentInSubtask(req.query.taskId, req.query.subtaskId, req.params.commentId);
        return res.status(200).json(comment);
    } catch (e) {
        return res.status(404).json({error: e});
    }
});

module.exports = router;