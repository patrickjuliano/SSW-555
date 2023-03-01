const express = require('express');
const router = express.Router();
const data = require('../data');
const projectData = data.projects;
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
        return res.status(404).json({error: e});
    }
});

router.post('/', async (req, res) => {
    if (!req.session.userId) return res.status(401).json({error: 'You are not logged in'});
    try {
        req.query.title = validation.checkString(req.query.title);
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const project = await projectData.createProject(req.session.userId, req.query.title);
        res.status(200).json(project);
    } catch (e) {
        res.status(404).json({error: e});
    }
});

// router.delete('/:id', async (req, res) => {
//     if (!req.session.userId) return res.status(401).json({error: 'You are not logged in'});
//     try {
//         req.params.id = validation.checkId(req.params.id);
//     } catch (e) {
//         return res.status(400).json({error: e});
//     }
//     try {
//         const project = await projectData.getProject(req.params.id);
//         if (project.owner !== req.session.userId) return res.status(403).json({error: "You cannot delete another user's project"});
//         const user = await projectData.removeProject(req.params.id);
//         return res.status(200).json(user);
//     } catch (e) {
//         return res.status(404).json({error: e});
//     }
// });

module.exports = router;