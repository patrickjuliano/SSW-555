const express = require('express');
const router = express.Router();
const data = require('../data');
const projectData = data.projects;
const activityData = data.activity;
const validation = require('../validation');

router.get('/:id', async (req, res) => {
    try {
        req.params.id = validation.checkId(req.params.id);
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const project = await projectData.getProject(req.params.id);
        return res.status(200).json(project);
    } catch (e) {
        return res.status(404).json({error: e});
    }
});

router.get('/users/:id', async (req, res) => {
    try {
        req.params.id = validation.checkId(req.params.id);
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const projects = await projectData.getAllProjects(req.params.id);
        return res.status(200).json({projects: projects});
    } catch (e) {
        console.log(e);
        return res.status(404).json({error: e});
    }
});

router.get('/:id/users', async (req, res) => {
    try {
        req.params.id = validation.checkId(req.params.id);
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const users = await projectData.getUsersInProject(req.params.id);
        return res.status(200).json(users);
    } catch (e) {
        return res.status(404).json({error: e});
    }
});

router.post('/', async (req, res) => {
    if (!req.session.userId) return res.status(401).json({error: 'You are not logged in'});
    try {
        req.query.title = validation.checkString(req.query.title);
        if (req.query.parentId !== undefined) {
            req.query.parentId = validation.checkId(req.query.parentId);
            req.query.addMembers = validation.checkBoolean(req.query.addMembers);
        }
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const project = await projectData.createProject(req.session.userId, req.query.title, req.query.parentId, req.query.addMembers);
        await activityData.createMessageFromProject(project._id, req.session.userId, `created the project`);
        if (req.query.parentId !== undefined) {
            await activityData.createMessageFromProject(req.query.parentId, req.session.userId, `created a subproject`, project.title);
        }
        res.status(200).json(project);
    } catch (e) {
        console.log(e);
        res.status(404).json({error: e});
    }
});

router.post('/:id/join', async (req, res) => {
    if (!req.session.userId) return res.status(401).json({error: 'You are not logged in'});
    try {
        req.params.id = validation.checkId(req.params.id);
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const project = await projectData.joinProject(req.session.userId, req.params.id);
        const message = await activityData.createMessageFromProject(project._id, req.session.userId, `joined the project`);
        res.status(200).json(project);
    } catch (e) {
        res.status(404).json({error: e});
    }
});

router.patch('/:id/move/:forward', async (req, res) => {
    if (!req.session.userId) return res.status(401).json({error: 'You are not logged in'});
    try {
        req.params.id = validation.checkId(req.params.id);
        req.params.forward = validation.checkBoolean(req.params.forward);
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const project = await projectData.moveProject(req.params.id, req.params.forward);
        const message = await activityData.createMessageFromProject(project._id, req.session.userId,
            `${project.stage === 8 ? 'marked the project as complete' : `${req.params.forward ? 'advanced' : 'returned'} the project to Stage ${project.stage + 1}`}`);
        res.status(200).json(project);
    } catch (e) {
        console.log(e);
        res.status(404).json({error: e});
    }
});

module.exports = router;