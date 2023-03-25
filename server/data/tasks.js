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
    const project = await projectCollection.findOne({ 'tasks._id': new ObjectId(taskId)});
    if (project === null) throw 'No task with that id';

    const task = project.tasks.find(task => task._id.toString() === taskId);
    task._id = task._id.toString();
    return task;
}

async function getAllTasks(taskId) {
    taskId = validation.checkId(taskId);

    const project = await projectData.getProject(taskId);
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
        stage: 0
    }

    const updateInfo = await projectCollection.updateOne({ _id: new ObjectId(projectId) }, { $addToSet: { tasks: newTask } });

    newTask._id = newTask._id.toString();
    return newTask;
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

module.exports = {
    getTask,
    getAllTasks,
    createTask,
    removeTask
}