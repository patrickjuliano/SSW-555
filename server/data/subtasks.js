const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const projects = mongoCollections.projects;
const { ObjectId } = require('mongodb');
const userData = require('./users');
const projectData = require('./projects');
const taskData = require('./tasks');
const validation = require('../validation');

async function getSubtask(taskId, subtaskId) {
    taskId = validation.checkId(taskId);
    subtaskId = validation.checkId(subtaskId);

    const subtasks = await getAllSubtasks(taskId);
    const subtask = subtasks.find(subtask => subtask._id.toString() === subtaskId);
    if (subtask === undefined) throw 'No subtask with that id';

    subtask._id = subtask._id.toString();
    for (let i = 0; i < subtask.comments.length; i++) {
        subtask.comments[i]._id = subtask.comments[i]._id.toString();
    }
    return subtask;
}

async function getAllSubtasks(taskId) {
    taskId = validation.checkId(taskId);

    const task = await taskData.getTask(taskId);
    return task.subtasks;
}

async function createSubtask(taskId, description) {
    taskId = validation.checkId(taskId);
    description = validation.checkString(description);

    const task = await taskData.getTask(taskId);

    const subtaskId = new ObjectId();
    let newSubtask = {
        _id: subtaskId,
        description: description,
        done: false,
        comments: []
    }

    const projectCollection = await projects();
    const updateInfo = await projectCollection.updateOne(
        { 'tasks._id': new ObjectId(taskId) }, 
        { $addToSet: { 'tasks.$[updateTask].subtasks': newSubtask } },
        { 'arrayFilters': [ { 'updateTask._id': new ObjectId(taskId) } ] }
    );

    newSubtask._id = newSubtask._id.toString();
    return newSubtask;
}

async function toggleSubtask(taskId, subtaskId, done) {
    taskId = validation.checkId(taskId);
    subtaskId = validation.checkId(subtaskId);
    done = validation.checkBoolean(done);

    const subtask = await getSubtask(taskId, subtaskId);
    
    const projectCollection = await projects();
    const updateInfo = await projectCollection.updateOne(
        { 'tasks._id': new ObjectId(taskId) }, 
        { $set: { 'tasks.$[updateTask].subtasks.$[updateSubtask].done': done } },
        { 'arrayFilters': [ { 'updateTask._id': new ObjectId(taskId) }, { 'updateSubtask._id': new ObjectId(subtaskId) } ] }
    );

    const updatedSubtask = await getSubtask(taskId, subtaskId);
    return updatedSubtask;
}

async function editSubtask(taskId, subtaskId, description) {
    taskId = validation.checkId(taskId);
    subtaskId = validation.checkId(subtaskId);
    description = validation.checkString(description);

    const subtask = await getSubtask(taskId, subtaskId);
    
    const projectCollection = await projects();
    const updateInfo = await projectCollection.updateOne(
        { 'tasks._id': new ObjectId(taskId) }, 
        { $set: { 'tasks.$[updateTask].subtasks.$[updateSubtask].description': description } },
        { 'arrayFilters': [ { 'updateTask._id': new ObjectId(taskId) }, { 'updateSubtask._id': new ObjectId(subtaskId) } ] }
    );

    const updatedSubtask = await getSubtask(taskId, subtaskId);
    return updatedSubtask;
}

async function removeSubtask(taskId, subtaskId) {
    taskId = validation.checkId(taskId);
    subtaskId = validation.checkId(subtaskId);
    
    const subtask = await getSubtask(taskId, subtaskId);
    
    const projectCollection = await projects();
    const updateInfo = await projectCollection.updateOne(
        { 'tasks._id': new ObjectId(taskId) }, 
        { $pull: { 'tasks.$[updateTask].subtasks': { _id: new ObjectId(subtaskId) } } },
        { 'arrayFilters': [ { 'updateTask._id': new ObjectId(taskId) } ] }
    );

    const updatedTask = await taskData.getTask(taskId);
    return updatedTask;
}

module.exports = {
    getSubtask,
    getAllSubtasks,
    createSubtask,
    toggleSubtask,
    editSubtask,
    removeSubtask
}