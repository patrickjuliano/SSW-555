
const activityData = require('./activity');
const commentData = require('./comments');
const photoData = require('./photos');
const projectData = require('./projects');
const subtaskData = require('./subtasks');
const taskData = require('./tasks');
const userData = require('./users');

module.exports = {
  activity: activityData,
  comments: commentData,
  photos: photoData,
  projects: projectData,
  subtasks: subtaskData,
  tasks: taskData,
  users: userData
};