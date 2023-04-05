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

module.exports = {
    getCommentInProject,
    getCommentInTask,
    getCommentInSubtask,
    getAllCommentsInProject,
    getAllCommentsInTask,
    getAllCommentsInSubtask
}