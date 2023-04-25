const express = require('express');
const router = express.Router();
const data = require('../data');
const taskData = data.tasks;
const subtaskData = data.subtasks;
const userData = data.users;
const activityData = data.activity;
const validation = require('../validation');
const { getTask } = require('../data/tasks');

const stages = ["Backlog", "To Do", "In Progress", "Done"]

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
        req.query.dueDate = validation.checkDate(req.query.dueDate);

        if ('subtask' in req.query) {
            for (let i = 0; i < req.query.subtask.length; i++) {
                req.query.subtask[i] = validation.checkString(req.query.subtask[i]);
            }
        }
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        let task = await taskData.createTask(req.session.userId, req.query.projectId, req.query.title, req.query.description, req.query.dueDate);
        await activityData.createMessageFromTask(task._id, req.session.userId, 'created a task', task.title);
        if ('subtask' in req.query) {
            for (let i = 0; i < req.query.subtask.length; i++) {
                const subtask = await subtaskData.createSubtask(task._id, req.query.subtask[i]);
                await activityData.createMessageFromSubtask(task._id, subtask._id, req.session.userId, 'created a subtask', `${task.title} > ${subtask.description}`);
            }
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
        req.query.dueDate = validation.checkDate(req.query.dueDate);
        if ('subtask' in req.query) {
            for (let i = 0; i < req.query.subtask.length; i++) {
                req.query.subtask[i] = validation.checkString(req.query.subtask[i]);
            }
        }
    } catch (e) {
        console.log(e);
        return res.status(400).json({error: e});
    }
    try {
        let task = await taskData.editTask(req.params.id, req.query.title, req.query.description, req.query.dueDate);
        await activityData.createMessageFromTask(task._id, req.session.userId, 'edited a task', task.title);
        if ('subtask' in req.query) {
            for (let i = 0; i < req.query.subtask.length; i++) {
                const subtask = await subtaskData.createSubtask(task._id, req.query.subtask[i]);
                await activityData.createMessageFromSubtask(task._id, subtask._id, req.session.userId, 'created a subtask', `${task.title} > ${subtask.description}`);
            }
        }
        task = await taskData.getTask(task._id);
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
        const task = await taskData.getTask(req.params.id);
        await activityData.createMessageFromTask(task._id, req.session.userId, 'deleted a task', task.title);
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
        await activityData.createMessageFromTask(task._id, req.session.userId, `${req.params.forward ? 'advanced' : 'returned'} a task to ${stages[task.stage]}`, task.title);
        res.status(200).json(task);
    } catch (e) {
        res.status(404).json({error: e});
    }
});

router.patch('/:taskId/subtasks/:subtaskId', async (req, res) => {
    if (!req.session.userId) return res.status(401).json({error: 'You are not logged in'});
    try {
        req.params.taskId = validation.checkId(req.params.taskId);
        req.params.subtaskId = validation.checkId(req.params.subtaskId);
        req.query.done = validation.checkBoolean(req.query.done);
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const task = await taskData.getTask(req.params.taskId);
        const subtask = await subtaskData.toggleSubtask(req.params.taskId, req.params.subtaskId, req.query.done);
        await activityData.createMessageFromSubtask(task._id, subtask._id, req.session.userId, `marked a subtask as ${req.query.done ? 'complete' : 'incomplete'}`, `${task.title} > ${subtask.description}`);
        res.status(200).json(subtask);
    } catch (e) {
        res.status(404).json({error: e});
    }
});

router.patch('/:taskId/subtasks/:subtaskId/edit', async (req, res) => {
    if (!req.session.userId) return res.status(401).json({error: 'You are not logged in'});
    try {
        req.params.taskId = validation.checkId(req.params.taskId);
        req.params.subtaskId = validation.checkId(req.params.subtaskId);
        req.query.description = validation.checkString(req.query.description);
    } catch (e) {
        console.log(e);
        return res.status(400).json({error: e});
    }
    try {
        const task = await taskData.getTask(req.params.taskId);
        let subtask = await subtaskData.getSubtask(req.params.taskId, req.params.subtaskId);
        if (subtask.description !== req.query.description) {
            subtask = await subtaskData.editSubtask(req.params.taskId, req.params.subtaskId, req.query.description);
            await activityData.createMessageFromSubtask(task._id, subtask._id, req.session.userId, 'edited a subtask', `${task.title} > ${subtask.description}`);
        }
        res.status(200).json(subtask);
    } catch (e) {
        console.log(e);
        res.status(404).json({error: e});
    }
});

router.delete('/:taskId/subtasks/:subtaskId', async (req, res) => {
    if (!req.session.userId) return res.status(401).json({error: 'You are not logged in'});
    try {
        req.params.taskId = validation.checkId(req.params.taskId);
        req.params.subtaskId = validation.checkId(req.params.subtaskId);
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        let task = await taskData.getTask(req.params.taskId);
        const subtask = await subtaskData.getSubtask(req.params.taskId, req.params.subtaskId);
        await activityData.createMessageFromSubtask(task._id, subtask._id, req.session.userId, 'deleted a subtask', `${task.title} > ${subtask.description}`);
        task = await subtaskData.removeSubtask(req.params.taskId, req.params.subtaskId);
        res.status(200).json(task);
    } catch (e) {
        console.log(e);
        res.status(404).json({error: e});
    }
});

router.patch('/:taskId/users/:userId', async (req, res) => {
    if (!req.session.userId) return res.status(401).json({error: 'You are not logged in'});
    try {
        req.params.taskId = validation.checkId(req.params.taskId);
        req.params.userId = validation.checkId(req.params.userId);
    } catch (e) {
        console.log(e);
        return res.status(400).json({error: e});
    }
    try {
        const user = await userData.getUser(req.params.userId);
        let task = await getTask(req.params.taskId);
        if (task.ownerId !== req.params.userId) {
            task = await taskData.assignTask(req.params.taskId, req.params.userId);
            await activityData.createMessageFromTask(task._id, req.session.userId, `assigned a task to ${user.firstName} ${user.lastName}`, task.title);
        }
        res.status(200).json(task);
    } catch (e) {
        console.log(e);
        res.status(404).json({error: e});
    }
});

router.delete('/:taskId/users', async (req, res) => {
    if (!req.session.userId) return res.status(401).json({error: 'You are not logged in'});
    try {
        req.params.taskId = validation.checkId(req.params.taskId);
    } catch (e) {
        console.log(e);
        return res.status(400).json({error: e});
    }
    try {
        let task = await getTask(req.params.taskId);
        if (task.ownerId !== '') {
            task = await taskData.unassignTask(req.params.taskId);
            await activityData.createMessageFromTask(task._id, req.session.userId, 'unassigned a task', task.title);
        }
        res.status(200).json(task);
    } catch (e) {
        console.log(e);
        res.status(404).json({error: e});
    }
});

module.exports = router;