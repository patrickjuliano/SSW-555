const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const projects = mongoCollections.projects;
const { ObjectId } = require('mongodb');
const userData = require('./users');
const projectData = require('./projects');
const validation = require('../validation');

async function getPhoto(photoId) {
    photoId = validation.checkId(photoId);

    const projectCollection = await projects();
    const project = await projectCollection.findOne({ 'photos._id': new ObjectId(photoId)});
    if (project === null) throw 'No photo with that id';

    const photo = project.photos.find(photo => photo._id.toString() === photoId);
    photo._id = photo._id.toString();
    return photo;
}

async function getAllPhotos(projectId) {
    projectId = validation.checkId(projectId);

    const project = await projectData.getProject(projectId);
    return project.photos;
}

async function createPhoto(projectId, title, required) {
    projectId = validation.checkId(projectId);
    title = validation.checkString(title);
    required = validation.checkBoolean(required);

    const project = await projectData.getProject(projectId);

    const projectCollection = await projects();
    const photoId = new ObjectId();
    let newPhoto = {
        _id: photoId,
        title: title,
        required: required,
        src: null
    }

    const updateInfo = await projectCollection.updateOne({ _id: new ObjectId(projectId) }, { $addToSet: { photos: newPhoto } });

    newPhoto._id = newPhoto._id.toString();
    return newPhoto;
}

async function editPhoto(photoId, title, required) {
    photoId = validation.checkId(photoId);
    title = validation.checkString(title);
    required = validation.checkBoolean(required);

    let photo = await getPhoto(photoId);

    const projectCollection = await projects();
    const updateInfo = await projectCollection.updateOne(
        { 'photos._id': new ObjectId(photoId) }, 
        { $set: { 'photos.$[updatePhoto].title': title, 'photos.$[updatePhoto].required': required } },
        { 'arrayFilters': [ { 'updatePhoto._id': new ObjectId(photoId) } ] }
    );

    photo = await getPhoto(photoId);
    return photo;
}

async function removePhoto(photoId) {
    photoId = validation.checkId(photoId);
    
    const projectCollection = await projects();
    const project = await projectCollection.findOne({ 'photos._id': new ObjectId(photoId)});
    if (project === null) throw 'No photo with that id';

    const updateInfo = await projectCollection.updateOne({ _id: project._id }, { $pull: { photos: { _id: new ObjectId(photoId) } } });

    const updatedProject = await projectData.getProject(project._id.toString());
    return updatedProject;
}

async function uploadPhoto(photoId, file) {
    photoId = validation.checkId(photoId);
    file = validation.checkFile(file);

    const projectCollection = await projects();
    const project = await projectCollection.findOne({ 'photos._id': new ObjectId(photoId)});
    if (project === null) throw 'No photo with that id';

    const updateInfo = await projectCollection.updateOne(
        { 'photos._id': new ObjectId(photoId) }, 
        { $set: { 'photos.$[updatePhoto].src': file } },
        { 'arrayFilters': [ { 'updatePhoto._id': new ObjectId(photoId) } ] }
    );

    const updatedPhoto = await getPhoto(photoId);
    return updatedPhoto;
}

module.exports = {
    getPhoto,
    getAllPhotos,
    createPhoto,
    editPhoto,
    removePhoto,
    uploadPhoto
}