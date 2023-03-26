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
        done: false
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

// async function editTask(taskId, title, description) {
//     taskId = validation.checkId(taskId);
//     title = validation.checkString(title);
//     description = validation.checkString(description);

//     let task = await getTask(taskId);

//     const projectCollection = await projects();
//     const updateInfo = await projectCollection.updateOne(
//         { 'tasks._id': new ObjectId(taskId) }, 
//         { $set: { 'tasks.$[updateTask].title': title, 'tasks.$[updateTask].description': description } },
//         { 'arrayFilters': [ { 'updateTask._id': new ObjectId(taskId) } ] }
//     );

//     task = await getTask(taskId);
//     return task;
// }

// async function removeTask(taskId) {
//     taskId = validation.checkId(taskId);
    
//     const projectCollection = await projects();
//     const project = await projectCollection.findOne({ 'tasks._id': new ObjectId(taskId)});
//     if (project === null) throw 'No task with that id';

//     const updateInfo = await projectCollection.updateOne({ _id: project._id }, { $pull: { tasks: { _id: new ObjectId(taskId) } } });

//     const updatedProject = await projectData.getProject(project._id.toString());
//     return updatedProject;
// }

module.exports = {
    getSubtask,
    getAllSubtasks,
    createSubtask,
    toggleSubtask
}