const mongoCollections = require('../config/mongoCollections');
const projects = mongoCollections.projects;
const { ObjectId } = require('mongodb');
const projectData = require('./projects');
const taskData = require('./tasks');
const subtaskData = require('./subtasks');
const validation = require('../validation');

async function getComment(comments, commentId) {
    commentId = validation.checkId(commentId);

    const comment = comments.find(comment => comment._id.toString() === commentId);
    if (comment === undefined) throw 'No comment with that id';

    comment._id = comment._id.toString();
    comment.userId = comment.userId.toString();
    return comment;
}
async function getCommentInProject(commentId) {
    commentId = validation.checkId(commentId);

    const projectCollection = await projects();
    const project = await projectCollection.findOne({ 'comments._id': new ObjectId(commentId) });
    if (project === null) throw 'No comment with that id';
    const comments = project.comments;

    return getComment(comments, commentId);
}
async function getCommentInTask(taskId, commentId) {
    taskId = validation.checkId(taskId);
    commentId = validation.checkId(commentId);

    const comments = await getAllCommentsInTask(taskId);

    return getComment(comments, commentId);
}
async function getCommentInSubtask(taskId, subtaskId, commentId) {
    taskId = validation.checkId(taskId);
    subtaskId = validation.checkId(subtaskId);
    commentId = validation.checkId(commentId);

    const comments = await getAllCommentsInSubtask(taskId, subtaskId);

    return getComment(comments, commentId);
}

async function getAllCommentsInProject(projectId) {
    projectId = validation.checkId(projectId);

    const project = await projectData.getProject(projectId);

    return project.comments;
}
async function getAllCommentsInTask(taskId) {
    taskId = validation.checkId(taskId);

    const task = await taskData.getTask(taskId);

    return task.comments;
}
async function getAllCommentsInSubtask(taskId, subtaskId) {
    taskId = validation.checkId(taskId);
    subtaskId = validation.checkId(subtaskId);

    const subtask = await subtaskData.getSubtask(taskId, subtaskId);

    return subtask.comments;
}

async function createComment(userId, content) {
    userId = validation.checkId(userId);
    content = validation.checkString(content);

    const comment = {
        _id: new ObjectId(),
        userId: new ObjectId(userId),
        date: new Date(),
        content: content
    }

    return comment;
}
async function createCommentInProject(projectId, userId, content) {
    projectId = validation.checkId(projectId);
    userId = validation.checkId(userId);
    content = validation.checkString(content);

    const comment = await createComment(userId, content);

    const projectCollection = await projects();
    const updateInfo = await projectCollection.updateOne({ _id: new ObjectId(projectId) }, { $addToSet: { comments: comment } });

    comment._id = comment._id.toString();
    return comment;
}
async function createCommentInTask(taskId, userId, content) {
    taskId = validation.checkId(taskId);
    userId = validation.checkId(userId);
    content = validation.checkString(content);

    const comment = await createComment(userId, content);

    const projectCollection = await projects();
    const updateInfo = await projectCollection.updateOne(
        { 'tasks._id': new ObjectId(taskId) }, 
        { $addToSet: { 'tasks.$[updateTask].comments': comment } },
        { 'arrayFilters': [ { 'updateTask._id': new ObjectId(taskId) } ] }
    );

    comment._id = comment._id.toString();
    return comment;
}
async function createCommentInSubtask(taskId, subtaskId, userId, content) {
    taskId = validation.checkId(taskId);
    subtaskId = validation.checkId(subtaskId);
    userId = validation.checkId(userId);
    content = validation.checkString(content);

    const comment = await createComment(userId, content);

    const projectCollection = await projects();
    const updateInfo = await projectCollection.updateOne(
        { 'tasks._id': new ObjectId(taskId) }, 
        { $addToSet: { 'tasks.$[updateTask].subtasks.$[updateSubtask].comments': comment } },
        { 'arrayFilters': [ { 'updateTask._id': new ObjectId(taskId) }, { 'updateSubtask._id': new ObjectId(subtaskId) } ] }
    );

    comment._id = comment._id.toString();
    return comment;
}

module.exports = {
    getCommentInProject,
    getCommentInTask,
    getCommentInSubtask,
    getAllCommentsInProject,
    getAllCommentsInTask,
    getAllCommentsInSubtask,
    createCommentInProject,
    createCommentInTask,
    createCommentInSubtask
}