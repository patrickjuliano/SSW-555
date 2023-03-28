let chai = require('chai');
const dbConnection = require('../config/mongoConnection');
const data = require('../data');
const userData = data.users;
const projectData = data.projects;

describe('Test project functionality', () => {
    let db;
    let user1;
    let user2;
    const title1 = 'Test Project 1';
    let project1;
    const title2 = 'Test Project 2';
    let project2;

    before('Connect to database', async () => {
        db = await dbConnection.dbConnection();
        await db.dropDatabase();

        user1 = await userData.createUser('John', 'Doe', 'john.doe@gmail.com', 'jdoe123', 'jdoe123', 'Construction Manager');
        user2 = await userData.createUser('Jane', 'Doe', 'jane.doe@gmail.com', 'jdoe123', 'jdoe123', 'Construction Manager');
        project1 = await projectData.createProject(user1._id, title1);
        project2 = await projectData.createProject(user2._id, title2);
    });

    describe('Test getProject', () => {
        it('Get project successfully', async () => {
            const newProject1 = await projectData.getProject(project1._id);
            const newProject2 = await projectData.getProject(project2._id);
            chai.expect(newProject1).to.have.property('_id', project1._id);
            chai.expect(newProject1).to.have.property('title', title1);
            chai.expect(newProject2).to.have.property('_id', project2._id);
            chai.expect(newProject2).to.have.property('title', title2);
        });
    });

    describe('Test getAllProjects', () => {
        it('Get all projects successfully', async () => {
            const projects = await projectData.getAllProjects(user1._id);
            chai.expect(projects[0]).to.have.property('_id', project1._id);
            chai.expect(projects[0]).to.have.property('title', title1);
        });
    });
    
    describe('Test createProject', () => {
        it('Create project successfully', async () => {
            const title = 'New Test Project';
            const project = await projectData.createProject(user1._id, title);
            chai.expect(project).to.have.property('_id');
            chai.expect(project).to.have.property('title', title);
        });
    });

    describe('Test joinProject', () => {
        it('Join project successfully', async () => {
            const project = await projectData.joinProject(user1._id, project2._id);
            chai.expect(project).to.have.property('_id', project2._id);
        });
    });

    after('Close connection', async () => {
        // await dbConnection.closeConnection();
    });
});