const express = require('express');
const router = express.Router();
const data = require('../data');
const commentData = data.comments;
const validation = require('../validation');

router.get('/projects/:commentId', async (req, res) => {
    if (!req.session.userId) return res.status(401).json({error: 'You are not logged in'});
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
    if (!req.session.userId) return res.status(401).json({error: 'You are not logged in'});
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
    if (!req.session.userId) return res.status(401).json({error: 'You are not logged in'});
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

router.post('/projects/:projectId', async (req, res) => {
    if (!req.session.userId) return res.status(401).json({error: 'You are not logged in'});
    try {
        req.params.projectId = validation.checkId(req.params.projectId);
        req.query.content = validation.checkString(req.query.content);
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const comment = await commentData.createCommentInProject(req.params.projectId, req.session.userId, req.query.content);
        return res.status(200).json(comment);
    } catch (e) {
        return res.status(404).json({error: e});
    }
});

router.post('/tasks/:taskId', async (req, res) => {
    if (!req.session.userId) return res.status(401).json({error: 'You are not logged in'});
    try {
        req.params.taskId = validation.checkId(req.params.taskId);
        req.query.content = validation.checkString(req.query.content);
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const comment = await commentData.createCommentInTask(req.params.taskId, req.session.userId, req.query.content);
        return res.status(200).json(comment);
    } catch (e) {
        return res.status(404).json({error: e});
    }
});

router.post('/subtasks/:taskId/:subtaskId', async (req, res) => {
    if (!req.session.userId) return res.status(401).json({error: 'You are not logged in'});
    try {
        req.params.taskId = validation.checkId(req.params.taskId);
        req.params.subtaskId = validation.checkId(req.params.subtaskId);
        req.query.content = validation.checkString(req.query.content);
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const comment = await commentData.createCommentInSubtask(req.params.taskId, req.params.subtaskId, req.session.userId, req.query.content);
        return res.status(200).json(comment);
    } catch (e) {
        return res.status(404).json({error: e});
    }
});

router.patch('/projects/:commentId', async (req, res) => {
    if (!req.session.userId) return res.status(401).json({error: 'You are not logged in'});
    try {
        req.params.commentId = validation.checkId(req.params.commentId);
        req.query.content = validation.checkString(req.query.content);
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const comment = await commentData.editCommentInProject(req.params.commentId, req.query.content);
        return res.status(200).json(comment);
    } catch (e) {
        return res.status(404).json({error: e});
    }
});

router.patch('/tasks/:commentId', async (req, res) => {
    if (!req.session.userId) return res.status(401).json({error: 'You are not logged in'});
    try {
        req.params.commentId = validation.checkId(req.params.commentId);
        req.query.taskId = validation.checkId(req.query.taskId);
        req.query.content = validation.checkString(req.query.content);
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const comment = await commentData.editCommentInTask(req.query.taskId, req.params.commentId, req.query.content);
        return res.status(200).json(comment);
    } catch (e) {
        return res.status(404).json({error: e});
    }
});

router.patch('/subtasks/:commentId', async (req, res) => {
    if (!req.session.userId) return res.status(401).json({error: 'You are not logged in'});
    try {
        req.params.commentId = validation.checkId(req.params.commentId);
        req.query.taskId = validation.checkId(req.query.taskId);
        req.query.subtaskId = validation.checkId(req.query.subtaskId);
        req.query.content = validation.checkString(req.query.content);
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const comment = await commentData.editCommentInSubtask(req.query.taskId, req.query.subtaskId, req.params.commentId, req.query.content);
        return res.status(200).json(comment);
    } catch (e) {
        return res.status(404).json({error: e});
    }
});

router.delete('/projects/:commentId', async (req, res) => {
    if (!req.session.userId) return res.status(401).json({error: 'You are not logged in'});
    try {
        req.params.commentId = validation.checkId(req.params.commentId);
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const project = await commentData.removeCommentInProject(req.params.commentId);
        return res.status(200).json(project);
    } catch (e) {
        return res.status(404).json({error: e});
    }
});

router.delete('/tasks/:commentId', async (req, res) => {
    if (!req.session.userId) return res.status(401).json({error: 'You are not logged in'});
    try {
        req.params.commentId = validation.checkId(req.params.commentId);
        req.query.taskId = validation.checkId(req.query.taskId);
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const task = await commentData.removeCommentInTask(req.query.taskId, req.params.commentId);
        return res.status(200).json(task);
    } catch (e) {
        return res.status(404).json({error: e});
    }
});

router.delete('/subtasks/:commentId', async (req, res) => {
    if (!req.session.userId) return res.status(401).json({error: 'You are not logged in'});
    try {
        req.params.commentId = validation.checkId(req.params.commentId);
        req.query.taskId = validation.checkId(req.query.taskId);
        req.query.subtaskId = validation.checkId(req.query.subtaskId);
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const subtask = await commentData.removeCommentInSubtask(req.query.taskId, req.query.subtaskId, req.params.commentId);
        return res.status(200).json(subtask);
    } catch (e) {
        return res.status(404).json({error: e});
    }
});

module.exports = router;