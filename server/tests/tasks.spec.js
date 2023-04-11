let chai = require('chai');
const dbConnection = require('../config/mongoConnection');
const data = require('../data');
const userData = data.users;
const projectData = data.projects;
const taskData = data.tasks;

describe('Test task functionality', () => {
    let db;
    let user;
    let project;
    const title1 = 'Test Task 1';
    const description1 = 'This is a task created for testing purposes';
    let task1;
    const title2 = 'Test Task 2';
    const description2 = 'This is another task created for testing purposes';
    let task2;

    before('Connect to database', async () => {
        db = await dbConnection.dbConnection();
        await db.dropDatabase();

        user = await userData.createUser('John', 'Doe', 'john.doe@gmail.com', 'jdoe123', 'jdoe123', 'Construction Manager');
        project = await projectData.createProject(user._id, 'Test Project');
        task1 = await taskData.createTask(project._id, title1, description1, new Date());
        task2 = await taskData.createTask(project._id, title2, description2, new Date());
    });

    describe('Test getTask', () => {
        it('Get task successfully', async () => {
            const newTask1 = await taskData.getTask(task1._id);
            const newTask2 = await taskData.getTask(task2._id);
            chai.expect(newTask1).to.have.property('_id', task1._id);
            chai.expect(newTask1).to.have.property('title', title1);
            chai.expect(newTask1).to.have.property('description', description1);
            chai.expect(newTask2).to.have.property('_id', task2._id);
            chai.expect(newTask2).to.have.property('title', title2);
            chai.expect(newTask2).to.have.property('description', description2);
        });
    });

    describe('Test getAllTasks', () => {
        it('Get all tasks successfully', async () => {
            const tasks = await taskData.getAllTasks(project._id);
            chai.expect(tasks[0]).to.have.property('_id', task1._id);
            chai.expect(tasks[0]).to.have.property('title', title1);
            chai.expect(tasks[0]).to.have.property('description', description1);
            chai.expect(tasks[1]).to.have.property('_id', task2._id);
            chai.expect(tasks[1]).to.have.property('title', title2);
            chai.expect(tasks[1]).to.have.property('description', description2);
        });
    });

    describe('Test createTask', () => {
        it('Create task successfully', async () => {
            const title = 'New Test Task';
            const description = 'This is a new task created for testing purposes';
            const task = await taskData.createTask(project._id, title, description, new Date());
            chai.expect(task).to.have.property('_id');
            chai.expect(task).to.have.property('title', title);
            chai.expect(task).to.have.property('description', description);
        });
    });

    describe('Test editTask', () => {
        it('Edit task successfully', async () => {
            const title = 'First Test Task';
            const description = 'This is a task created for testing purposes, now featuring a longer description';
            task1 = await taskData.editTask(task1._id, title, description, new Date());
            chai.expect(task1).to.have.property('title', title);
            chai.expect(task1).to.have.property('description', description);
        });
    });

    describe('Test removeTask', () => {
        it('Remove task successfully', async () => {
            const id = task2._id;
            project = await taskData.removeTask(task2._id);
            chai.expect(project.tasks.map(task => ({ _id: task._id }))).to.not.include({ _id: id });
        });
    });

    describe('Test moveTask', () => {
        it('Remove task successfully', async () => {
            task1 = await taskData.moveTask(task1._id, true);
            chai.expect(task1).to.have.property('stage', 1);
        });
    });

    describe('Test assignTask', () => {
        it('Assign task successfully', async () => {
            task1 = await taskData.assignTask(task1._id, user._id);
            chai.expect(task1).to.have.property('ownerId', user._id);
        });
    });

    describe('Test unassignTask', () => {
        it('Unassign task successfully', async () => {
            task1 = await taskData.unassignTask(task1._id);
            chai.expect(task1).to.have.property('ownerId', '');
        });
    });

    after('Close connection', async () => {
        await dbConnection.closeConnection();
    });
});