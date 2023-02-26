const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const { ObjectId } = require('mongodb');
const userData = require('./users');
const validation = require('../validation');

async function getProject(projectId) {
    projectId = validation.checkId(projectId);

    const user = await userData.getUserByProject(projectId);
    const project = user.projects.find(p => p._id.toString() === projectId);
    project._id = project._id.toString();
    return project;
}

async function getAllProjects(userId) {
    userId = validation.checkId(userId);

    const user = await userData.getUser(userId);
    return user.projects;
}

async function createProject(userId, title) {
    userId = validation.checkId(userId);
    title = validation.checkString(title);
    
    const user = await userData.getUser(userId);
    const userCollection = await users();
    const projectId = new ObjectId();
    const newProject = {
        _id: projectId,
        title: title,
        owner: user._id
    }
    
    const updateInfo = await userCollection.updateOne({ _id: new ObjectId(userId) }, { $addToSet: { projects: newProject } });

    newProject._id = newProject._id.toString();
    return newProject;


    // return userCollection
    //     .updateOne({ _id: new ObjectId(userId) }, { $addToSet: { projects: newProject } })
    //     .then(async function () {
    //         newProject._id = newProject._id.toString();
    //         return newProject;
    //     });
}

async function removeProject(projectId) {
    projectId = validation.checkId(projectId);

    const userCollection = await users();
    const user = await userData.getUserByProject(projectId);

    return userCollection
        .updateOne({ _id: ObjectId(user._id) }, { $pull: { projects: { _id: ObjectId(projectId) } } })
        .then(async function () {
            const updatedUser = await userData.getUser(user._id);
            return updatedUser;
        })
}

module.exports = {
    getProject,
    getAllProjects,
    createProject,
    removeProject
}