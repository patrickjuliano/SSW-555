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

module.exports = router;