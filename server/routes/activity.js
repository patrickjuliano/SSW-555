const express = require('express');
const router = express.Router();
const data = require('../data');
const activityData = data.activity;
const validation = require('../validation');

router.get('/:messageId', async (req, res) => {
    if (!req.session.userId) return res.status(401).json({error: 'You are not logged in'});
    try {
        req.params.messageId = validation.checkId(req.params.messageId);
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const message = await activityData.getMessage(req.params.messageId);
        return res.status(200).json(message);
    } catch (e) {
        return res.status(404).json({error: e});
    }
});

router.get('/projects/:projectId', async (req, res) => {
    try {
        req.params.projectId = validation.checkId(req.params.projectId);
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const activity = await activityData.getAllMessages(req.params.projectId);
        return res.status(200).json(activity);
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
        const message = await activityData.createMessageFromProject(req.params.projectId, req.session.userId, req.query.content);
        return res.status(200).json(message);
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
        const message = await activityData.createMessageFromTask(req.params.taskId, req.session.userId, req.query.content);
        return res.status(200).json(message);
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
        const message = await activityData.createMessageFromSubtask(req.params.taskId, req.params.subtaskId, req.session.userId, req.query.content);
        return res.status(200).json(message);
    } catch (e) {
        return res.status(404).json({error: e});
    }
});

router.patch('/:messageId', async (req, res) => {
    if (!req.session.userId) return res.status(401).json({error: 'You are not logged in'});
    try {
        req.params.messageId = validation.checkId(req.params.messageId);
        req.query.content = validation.checkString(req.query.content);
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const message = await activityData.editMessage(req.params.messageId, req.query.content);
        return res.status(200).json(message);
    } catch (e) {
        return res.status(404).json({error: e});
    }
});

router.delete('/:messageId', async (req, res) => {
    if (!req.session.userId) return res.status(401).json({error: 'You are not logged in'});
    try {
        req.params.messageId = validation.checkId(req.params.messageId);
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const project = await activityData.removeMessage(req.params.messageId);
        return res.status(200).json(project);
    } catch (e) {
        return res.status(404).json({error: e});
    }
});

module.exports = router;