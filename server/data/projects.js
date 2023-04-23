const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const projects = mongoCollections.projects;
const { ObjectId } = require('mongodb');
const userData = require('./users');
const activityData = require('./activity');
const validation = require('../validation');

async function getProject(projectId, getParent = true, getChildren = true) {
    projectId = validation.checkId(projectId);
    getParent = validation.checkBoolean(getParent);
    getChildren = validation.checkBoolean(getChildren);
    
    // Find project
    const projectCollection = await projects();
    const project = await projectCollection.findOne({_id: new ObjectId(projectId)});
    if (project === null) throw 'No project with that id';

    // Stringify ids
    project._id = project._id.toString();
    for (let i = 0; i < project.tasks.length; i++) {
        project.tasks[i]._id = project.tasks[i]._id.toString();
        project.tasks[i].ownerId = project.tasks[i].ownerId.toString();
        for (let j = 0; j < project.tasks[i].subtasks.length; j++) {
            project.tasks[i].subtasks[j]._id = project.tasks[i].subtasks[j]._id.toString();
            for (let k = 0; k < project.tasks[i].subtasks[j].comments; k++) {
                project.tasks[i].subtasks[j].comments[k]._id = project.tasks[i].subtasks[j].comments[k]._id.toString();
            }
        }
        for (let j = 0; j < project.tasks[i].comments.length; j++) {
            project.tasks[i].comments[j]._id = project.tasks[i].comments[j]._id.toString();
        }
    }
    for (let i = 0; i < project.photos.length; i++) {
        project.photos[i]._id = project.photos[i]._id.toString();
    }
    for (let i = 0; i < project.comments.length; i++) {
        project.comments[i]._id = project.comments[i]._id.toString();
    }
    for (let i = 0; i < project.activity.length; i++) {
        project.activity[i]._id = project.activity[i]._id.toString();
        project.activity[i].userId = project.activity[i].userId.toString();
        if ('taskId' in project.activity[i]) project.activity[i].taskId = project.activity[i].taskId.toString();
        if ('subtaskId' in project.activity[i]) project.activity[i].subtaskId = project.activity[i].subtaskId.toString();
    }

    // Attach parent project
    if (project.parentId !== null) {
        project.parentId = project.parentId.toString();

        if (getParent) {
            const rawParent = await getProject(project.parentId, false, false);
            const parent = {
                _id: rawParent._id.toString(),
                title: rawParent.title
            }
            project.parent = parent;
        }
    } else {
        if (getParent) project.parent = null;
    }

    // Attach child projects
    if (getChildren) {
        project.subprojects = [];
        const rawSubprojects = await projectCollection.find({parentId: new ObjectId(projectId)}).toArray();
        for (const rawSubproject of rawSubprojects) {
            const subproject = {
                _id: rawSubproject._id.toString(),
                title: rawSubproject.title
            }
            project.subprojects.push(subproject);
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

async function createProject(userId, title, parentId, addMembers) {
    userId = validation.checkId(userId);
    title = validation.checkString(title);
    if (parentId !== undefined) {
        parentId = validation.checkId(parentId);
        addMembers = validation.checkBoolean(addMembers);
        
        const parent = await getProject(parentId);
        parentId = new ObjectId(parentId);
    } else {
        parentId = null;
    }
    
    const user = await userData.getUser(userId);
    const userCollection = await users();
    const projectCollection = await projects();
    const projectId = new ObjectId();
    const newProject = {
        _id: projectId,
        title: title,
        parentId: parentId,
        owner: new ObjectId(user._id),
        stage: 0,
        tasks: [],
        photos: [],
        comments: [],
        activity: []
    }
    
    const insertInfo = await projectCollection.insertOne(newProject);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Could not add project';
    const updateInfo = await userCollection.updateOne({ _id: new ObjectId(userId) }, { $addToSet: { projects: new ObjectId(projectId) } });

    // If created as subproject and prompted to do so, add all members of parent project to subproject
    if (parentId !== null && addMembers === true) {
        const users = await getUsersInProject(parentId.toString());
        for (const user of users) {
            await joinProject(user._id, projectId.toString(), false);
        }
    }

    const project = await getProject(projectId.toString());
    return project;
}

async function joinProject(userId, projectId, throwIfMember = true) {
    userId = validation.checkId(userId);
    projectId = validation.checkId(projectId);
    throwIfMember = validation.checkBoolean(throwIfMember);

    const user = await userData.getUser(userId);
    let project = await getProject(projectId);

    let inProject = false;
    for (const id of user.projects) {
        if (id === projectId) {
            inProject = true;
            break;
        }
    }
    if (inProject && throwIfMember) throw 'User already belongs to this project';

    if (!inProject) {
        const userCollection = await users();
        const updateInfo = await userCollection.updateOne({ _id: new ObjectId(userId) }, { $addToSet: { projects: new ObjectId(projectId) } });
    }

    // Join parent project if it exists
    if (project.parentId !== null) {
        await joinProject(userId, project.parentId, false);
    }

    project = await getProject(projectId);
    return project;
}

async function getUsersInProject(projectId) {
    projectId = validation.checkId(projectId);
    
    const project = await getProject(projectId);
    
    const allUsers = await userData.getAllUsers();
    const users = allUsers.filter(user => user.projects.includes(projectId));
    
    return users;
}

async function findUserInProject(userId, projectId) {
    userId = validation.checkId(userId);
    projectId = validation.checkId(projectId);

    const user = await userData.getUser(userId);
    const project = await getProject(projectId);
    if (!user.projects.some(project => project._id === projectId)) 'User does not belong to this project'

    return user;
}

async function moveProject(projectId, forward) {
    projectId = validation.checkId(projectId);
    forward = validation.checkBoolean(forward);

    const project = await getProject(projectId);

    const newStage = forward ? Math.min(project.stage + 1, 8) : Math.max(project.stage - 1, 0);

    const projectCollection = await projects();
    const updateInfo = await projectCollection.updateOne(
        { _id: new ObjectId(projectId) }, 
        { $set: { stage: newStage } }
    );

    const updatedProject = await getProject(projectId);
    return updatedProject;
}

module.exports = {
    getProject,
    getAllProjects,
    createProject,
    joinProject,
    getUsersInProject,
    findUserInProject,
    moveProject
}