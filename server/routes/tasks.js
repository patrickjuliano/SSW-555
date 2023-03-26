const express = require('express');
const router = express.Router();
const data = require('../data');
const taskData = data.tasks;
const subtaskData = data.subtasks;
const validation = require('../validation');

router.get('/:id', async (req, res) => {
    try {
        req.params.id = validation.checkId(req.params.id);
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const task = await taskData.getTask(req.params.id);
        return res.status(200).json(task);
    } catch (e) {
        return res.status(404).json({error: e});
    }
});

router.get('/projects/:id', async (req, res) => {
    try {
        req.params.id = validation.checkId(req.params.id);
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const tasks = await taskData.getAllTasks(req.params.id);
        return res.status(200).json({tasks: tasks});
    } catch (e) {
        return res.status(404).json({error: e});
    }
});

router.post('/', async (req, res) => {
    if (!req.session.userId) return res.status(401).json({error: 'You are not logged in'});
    try {
        req.query.projectId = validation.checkId(req.query.projectId);
        req.query.title = validation.checkString(req.query.title);
        req.query.description = validation.checkString(req.query.description);
        for (let i = 0; i < req.query.subtask.length; i++) {
            req.query.subtask[i] = validation.checkString(req.query.subtask[i]);
        }
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        let task = await taskData.createTask(req.query.projectId, req.query.title, req.query.description);
        for (let i = 0; i < req.query.subtask.length; i++) {
            const subtask = await subtaskData.createSubtask(task._id, req.query.subtask[i]);
        }
        task = await taskData.getTask(task._id);
        res.status(200).json(task);
    } catch (e) {
        console.log(e);
        res.status(404).json({error: e});
    }
});

router.put('/:id', async (req, res) => {
    if (!req.session.userId) return res.status(401).json({error: 'You are not logged in'});
    try {
        req.params.id = validation.checkId(req.params.id);
        req.query.title = validation.checkString(req.query.title);
        req.query.description = validation.checkString(req.query.description);
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const task = await taskData.editTask(req.params.id, req.query.title, req.query.description);
        res.status(200).json(task);
    } catch (e) {
        console.log(e);
        res.status(404).json({error: e});
    }
});

router.delete('/:id', async (req, res) => {
    if (!req.session.userId) return res.status(401).json({error: 'You are not logged in'});
    try {
        req.params.id = validation.checkId(req.params.id);
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const project = await taskData.removeTask(req.params.id);
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
        const task = await taskData.moveTask(req.params.id, req.params.forward);
        res.status(200).json(task);
    } catch (e) {
        res.status(404).json({error: e});
    }
});

// router.patch('/:id/upload', async (req, res) => {
//     console.log("A");
//     if (!req.session.userId) return res.status(401).json({error: 'You are not logged in'});
//     console.log("B");
//     try {
//         req.params.id = validation.checkId(req.params.id);
//         req.query.file = validation.checkFile(req.query.file);
//     } catch (e) {
//         console.log(e);
//         return res.status(400).json({error: e});
//     }
//     console.log("C");
//     try {
//         const photo = await photoData.uploadPhoto(req.params.id, req.query.file);
//         res.status(200).json(photo);
//     } catch (e) {
//         console.log(e);
//         res.status(404).json({error: e});
//     }
// });

module.exports = router;