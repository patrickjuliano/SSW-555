const mongoCollections = require('../config/mongoCollections');
const projects = mongoCollections.projects;
const { ObjectId } = require('mongodb');
const validation = require('../validation');

async function getMessage(messageId) {
    messageId = validation.checkId(messageId);

    const projectCollection = await projects();
    const project = await projectCollection.findOne({ 'activity._id': new ObjectId(messageId) });
    if (project === null) throw 'No message with that id';

    const message = project.activity.find(message => message._id.toString() === messageId);
    message._id = message._id.toString();
    message.userId = message.userId.toString();
    if ('taskId' in message) message.taskId = message.taskId.toString();
    if ('subtaskId' in message) message.subtaskId = message.subtaskId.toString();
    return message;
}

async function getAllMessages(projectId) {
    projectId = validation.checkId(projectId);

    const projectCollection = await projects();
    const project = await projectCollection.findOne({ _id: new ObjectId(projectId) });
    if (project === null) throw 'No project with that id';

    for (let i = 0; i < project.activity.length; i++) {
        project.activity[i]._id = project.activity[i]._id.toString();
        project.activity[i].userId = project.activity[i].userId.toString();
    }
    return project.activity;
}

async function getProjectIdFromTaskId(taskId) {
    taskId = await validation.checkId(taskId);

    const projectCollection = await projects();
    const project = await projectCollection.findOne({ 'tasks._id': new ObjectId(taskId) });
    if (project === null) throw 'No task with that id';

    return project._id.toString();
}

module.exports = {
    getMessage,
    getAllMessages
}