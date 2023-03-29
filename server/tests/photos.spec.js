let chai = require('chai');
const dbConnection = require('../config/mongoConnection');
const data = require('../data');
const userData = data.users;
const projectData = data.projects;
const photoData = data.photos;

describe('Test photo functionality', () => {
    let db;
    let user;
    let project;
    const title1 = 'Test Photo 1';
    const required1 = false;
    let photo1;
    const title2 = 'Test Photo 2';
    const required2 = true;
    let photo2;

    before('Connect to database', async () => {
        db = await dbConnection.dbConnection();
        await db.dropDatabase();

        user = await userData.createUser('John', 'Doe', 'john.doe@gmail.com', 'jdoe123', 'jdoe123', 'Construction Manager');
        project = await projectData.createProject(user._id, 'Test Project');
        photo1 = await photoData.createPhoto(project._id, title1, required1);
        photo2 = await photoData.createPhoto(project._id, title2, required2);
    });

    describe('Test getPhoto', () => {
        it('Get photo successfully', async () => {
            const newPhoto1 = await photoData.getPhoto(photo1._id);
            const newPhoto2 = await photoData.getPhoto(photo2._id);
            chai.expect(newPhoto1).to.have.property('_id', photo1._id);
            chai.expect(newPhoto1).to.have.property('title', title1);
            chai.expect(newPhoto1).to.have.property('required', required1);
            chai.expect(newPhoto2).to.have.property('_id', photo2._id);
            chai.expect(newPhoto2).to.have.property('title', title2);
            chai.expect(newPhoto2).to.have.property('required', required2);
        });
    });

    describe('Test getAllPhotos', () => {
        it('Get all photos successfully', async () => {
            const photos = await photoData.getAllPhotos(project._id);
            chai.expect(photos[0]).to.have.property('_id', photo1._id);
            chai.expect(photos[0]).to.have.property('title', title1);
            chai.expect(photos[0]).to.have.property('required', required1);
            chai.expect(photos[1]).to.have.property('_id', photo2._id);
            chai.expect(photos[1]).to.have.property('title', title2);
            chai.expect(photos[1]).to.have.property('required', required2);
        });
    });

    describe('Test createPhoto', () => {
        it('Create photo successfully', async () => {
            const title = 'New Test Photo';
            const required = false;
            const photo = await photoData.createPhoto(project._id, title, required);
            chai.expect(photo).to.have.property('_id');
            chai.expect(photo).to.have.property('title', title);
            chai.expect(photo).to.have.property('required', required);
        });
    });

    describe('Test editPhoto', () => {
        it('Edit photo successfully', async () => {
            const title = 'First Test Photo';
            const required = true;
            photo1 = await photoData.editPhoto(photo1._id, title, required);
            chai.expect(photo1).to.have.property('title', title);
            chai.expect(photo1).to.have.property('required', required);
        });
    });
    
    describe('Test removePhoto', () => {
        it('Remove photo successfully', async () => {
            const id = photo2._id;
            project = await photoData.removePhoto(photo2._id);
            chai.expect(project.photos.map(photo => ({ _id: photo._id }))).to.not.include({ _id: id });
        });
    });
    
    describe('Test uploadPhoto', () => {
        it('Upload photo successfully', async () => {
            const src = 'https://images.unsplash.com/photo-1606921231106-f1083329a65c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80';
            photo1 = await photoData.uploadPhoto(photo1._id, src);
            chai.expect(photo1).to.have.property('src', src);
        });
    });
    
    describe('Test rescindPhoto', () => {
        it('Rescind photo successfully', async () => {
            photo1 = await photoData.rescindPhoto(photo1._id);
            chai.expect(photo1).to.have.property('src', null);
        });
    });

    after('Close connection', async () => {
        // await dbConnection.closeConnection();
    });
});