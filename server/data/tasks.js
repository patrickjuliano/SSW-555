const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const projects = mongoCollections.projects;
const { ObjectId } = require('mongodb');
const userData = require('./users');
const projectData = require('./projects');
const validation = require('../validation');

async function getTask(taskId) {
    taskId = validation.checkId(taskId);

    const projectCollection = await projects();
    const project = await projectCollection.findOne({ 'tasks._id': new ObjectId(taskId) });
    if (project === null) throw 'No task with that id';

    const task = project.tasks.find(task => task._id.toString() === taskId);
    task._id = task._id.toString();
    return task;
}

async function getAllTasks(projectId) {
    projectId = validation.checkId(projectId);

    const project = await projectData.getProject(projectId);
    return project.tasks;
}

async function createTask(projectId, title, description) {
    projectId = validation.checkId(projectId);
    title = validation.checkString(title);
    description = validation.checkString(description);

    const project = projectData.getProject(projectId);

    const projectCollection = await projects();
    const taskId = new ObjectId();
    let newTask = {
        _id: taskId,
        title: title,
        description: description,
        stage: 0,
        subtasks: []
    }

    const updateInfo = await projectCollection.updateOne({ _id: new ObjectId(projectId) }, { $addToSet: { tasks: newTask } });

    newTask._id = newTask._id.toString();
    return newTask;
}

async function editTask(taskId, title, description) {
    taskId = validation.checkId(taskId);
    title = validation.checkString(title);
    description = validation.checkString(description);

    let task = await getTask(taskId);

    const projectCollection = await projects();
    const updateInfo = await projectCollection.updateOne(
        { 'tasks._id': new ObjectId(taskId) }, 
        { $set: { 'tasks.$[updateTask].title': title, 'tasks.$[updateTask].description': description } },
        { 'arrayFilters': [ { 'updateTask._id': new ObjectId(taskId) } ] }
    );

    task = await getTask(taskId);
    return task;
}

async function removeTask(taskId) {
    taskId = validation.checkId(taskId);
    
    const projectCollection = await projects();
    const project = await projectCollection.findOne({ 'tasks._id': new ObjectId(taskId)});
    if (project === null) throw 'No task with that id';

    const updateInfo = await projectCollection.updateOne({ _id: project._id }, { $pull: { tasks: { _id: new ObjectId(taskId) } } });

    const updatedProject = await projectData.getProject(project._id.toString());
    return updatedProject;
}

async function moveTask(taskId, forward) {
    taskId = validation.checkId(taskId);
    forward = validation.checkBoolean(forward);

    const projectCollection = await projects();
    const project = await projectCollection.findOne({ 'tasks._id': new ObjectId(taskId)});
    if (project === null) throw 'No task with that id';

    const task = await getTask(taskId);
    const newStage = forward ? Math.min(task.stage + 1, 3) : Math.max(task.stage - 1, 0);

    const updateInfo = await projectCollection.updateOne(
        { 'tasks._id': new ObjectId(taskId) }, 
        { $set: { 'tasks.$[updateTask].stage': newStage } },
        { 'arrayFilters': [ { 'updateTask._id': new ObjectId(taskId) } ] }
    );

    const updatedTask = await getTask(taskId);
    return updatedTask;
}

module.exports = {
    getTask,
    getAllTasks,
    createTask,
    editTask,
    removeTask,
    moveTask
}