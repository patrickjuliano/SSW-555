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

async function createMessage(projectId, projectTitle, userId, content, tags, level, taskId, subtaskId) {
    projectId = validation.checkId(projectId);
    projectTitle = validation.checkString(projectTitle);
    userId = validation.checkId(userId);
    content = validation.checkString(content);
    if (tags !== undefined) tags = validation.checkString(tags);
    level = validation.checkNonnegativeInteger(level);
    if (level > 0) taskId = validation.checkId(taskId);
    if (level > 1) subtaskId = validation.checkId(subtaskId);

    content += ` [${projectTitle}${tags !== undefined ? ` > ${tags}` : ''}]`;

    const projectCollection = await projects();
    const project = await projectCollection.findOne({ _id: new ObjectId(projectId) });
    if (project === null) throw 'No project with that id';

    const messageId = new ObjectId();
    const message = {
        _id: messageId,
        userId: new ObjectId(userId),
        date: new Date(),
        content,
        level
    }
    if (level > 0) message.taskId = new ObjectId(taskId);
    if (level > 1) message.subtaskId = new ObjectId(subtaskId);

    const updateInfo = await projectCollection.updateOne(
        { _id: new ObjectId(projectId) },
        { $addToSet: { activity: message } }
    );

    return await getMessage(messageId.toString());
}

async function createMessageFromProject(projectId, userId, content, tags) {
    const project = await getProject(projectId);
    return await createMessage(project._id, project.title, userId, content, tags, 0);
}

async function createMessageFromTask(taskId, userId, content, tags) {
    const project = await getProjectFromTaskId(taskId);
    return await createMessage(project._id, project.title, userId, content, tags, 1, taskId);
}

async function createMessageFromSubtask(taskId, subtaskId, userId, content, tags) {
    const project = await getProjectFromTaskId(taskId);
    return await createMessage(project._id, project.title, userId, content, tags, 2, taskId, subtaskId);
}

async function getProject(projectId) {
    projectId = await validation.checkId(projectId);

    const projectCollection = await projects();
    const project = await projectCollection.findOne({ _id: new ObjectId(projectId) });
    if (project === null) throw 'No project with that id';

    project._id = project._id.toString()
    return project;
}

async function getProjectFromTaskId(taskId) {
    taskId = await validation.checkId(taskId);

    const projectCollection = await projects();
    const project = await projectCollection.findOne({ 'tasks._id': new ObjectId(taskId) });
    if (project === null) throw 'No task with that id';

    project._id = project._id.toString()
    return project;
}

async function editMessage(messageId, content) {
    messageId = validation.checkId(messageId);
    content = validation.checkString(content);

    let message = await getMessage(messageId);

    const projectCollection = await projects();
    const updateInfo = await projectCollection.updateOne(
        { 'activity._id': new ObjectId(messageId) }, 
        { $set: { 'activity.$[updateMessage].content': content } },
        { 'arrayFilters': [ { 'updateMessage._id': new ObjectId(messageId) } ] }
    );

    message = await getMessage(messageId);
    return message;
}

async function removeMessage(messageId) {
    messageId = validation.checkId(messageId);

    const projectCollection = await projects();
    const project = await projectCollection.findOne({ 'activity._id': new ObjectId(messageId) });
    if (project === null) throw 'No message with that id';

    const updateInfo = await projectCollection.updateOne({ _id: project._id }, { $pull: { activity: { _id: new ObjectId(messageId) } } });

    return { success: true };
}

module.exports = {
    getMessage,
    getAllMessages,
    createMessageFromProject,
    createMessageFromTask,
    createMessageFromSubtask,
    editMessage,
    removeMessage
}