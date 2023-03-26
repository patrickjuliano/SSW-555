const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const projects = mongoCollections.projects;
const { ObjectId } = require('mongodb');
const userData = require('./users');
const validation = require('../validation');

async function getProject(projectId) {
    projectId = validation.checkId(projectId);

    const projectCollection = await projects();
    const project = await projectCollection.findOne({_id: new ObjectId(projectId)});
    if (project === null) throw 'No user with that id';

    project._id = project._id.toString();
    for (let i = 0; i < project.photos.length; i++) {
        project.photos[i]._id = project.photos[i]._id.toString();
    }
    for (let i = 0; i < project.tasks.length; i++) {
        project.tasks[i]._id = project.tasks[i]._id.toString();
        for (let j = 0; j < project.tasks[i].subtasks.length; j++) {
            project.tasks[i].subtasks[j]._id = project.tasks[i].subtasks[j]._id.toString();
        }
    }
    return project;
}

async function getAllProjects(userId) {
    userId = validation.checkId(userId);
    
    const user = await userData.getUser(userId);

    const projects = [];
    for (const projectId of user.projects) {
        const project = await getProject(projectId);
        projects.push(project);
    }

    return projects;
}

async function createProject(userId, title) {
    userId = validation.checkId(userId);
    title = validation.checkString(title);
    
    const user = await userData.getUser(userId);
    const userCollection = await users();
    const projectCollection = await projects();
    const projectId = new ObjectId();
    const newProject = {
        _id: projectId,
        title: title,
        owner: new ObjectId(user._id),
        tasks: [],
        photos: []
    }
    
    const insertInfo = await projectCollection.insertOne(newProject);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Could not add project';
    const updateInfo = await userCollection.updateOne({ _id: new ObjectId(userId) }, { $addToSet: { projects: projectId } });

    newProject._id = newProject._id.toString();
    return newProject;
}

async function joinProject(userId, projectId) {
    userId = validation.checkId(userId);
    projectId = validation.checkId(projectId);

    const user = await userData.getUser(userId);
    const project = await getProject(projectId);

    const inProject = false;
    for (const id of user.projects) {
        if (id === projectId) {
            inProject = true;
            break;
        }
    }
    if (inProject) throw 'User already belongs to this project';

    const userCollection = await users();
    const updateInfo = await userCollection.updateOne({ _id: new ObjectId(userId) }, { $addToSet: { projects: projectId } });
    
    return project;
}

// async function removeProject(projectId) {
//     projectId = validation.checkId(projectId);

//     const userCollection = await users();
//     const user = await userData.getUserByProject(projectId);

//     return userCollection
//         .updateOne({ _id: new ObjectId(user._id) }, { $pull: { projects: { _id: new ObjectId(projectId) } } })
//         .then(async function () {
//             const updatedUser = await userData.getUser(user._id);
//             return updatedUser;
//         })
// }

module.exports = {
    getProject,
    getAllProjects,
    createProject,
    joinProject,
    // removeProject
}