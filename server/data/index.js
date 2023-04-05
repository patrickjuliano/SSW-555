
const commentData = require('./comments');
const photoData = require('./photos');
const projectData = require('./projects');
const subtaskData = require('./subtasks');
const taskData = require('./tasks');
const userData = require('./users');

module.exports = {
  comments: commentData,
  photos: photoData,
  projects: projectData,
  subtasks: subtaskData,
  tasks: taskData,
  users: userData
};