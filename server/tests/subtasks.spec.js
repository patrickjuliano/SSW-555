let chai = require('chai');
const dbConnection = require('../config/mongoConnection');
const data = require('../data');
const userData = data.users;
const projectData = data.projects;
const taskData = data.tasks;
const subtaskData = data.subtasks;

describe('Test subtask functionality', () => {
    let db;
    let user;
    let project;
    let task;
    const description1 = 'This is a subtask created for testing purposes';
    let subtask1;
    const description2 = 'This is another subtask created for testing purposes';
    let subtask2;

    before('Connect to database', async () => {
        db = await dbConnection.dbConnection();
        await db.dropDatabase();

        user = await userData.createUser('John', 'Doe', 'john.doe@gmail.com', 'jdoe123', 'jdoe123', 'Construction Manager');
        project = await projectData.createProject(user._id, 'Test Project');
        task = await taskData.createTask(user._id, project._id, 'Test Task', 'This is a task created for testing purposes', new Date());
        subtask1 = await subtaskData.createSubtask(task._id, description1);
        subtask2 = await subtaskData.createSubtask(task._id, description2);
    });

    describe('Test getSubtask', () => {
        it('Get subtask successfully', async () => {
            const newSubtask1 = await subtaskData.getSubtask(task._id, subtask1._id);
            const newSubtask2 = await subtaskData.getSubtask(task._id, subtask2._id);
            chai.expect(newSubtask1).to.have.property('_id', subtask1._id);
            chai.expect(newSubtask1).to.have.property('description', description1);
            chai.expect(newSubtask2).to.have.property('_id', subtask2._id);
            chai.expect(newSubtask2).to.have.property('description', description2);
        });
    });

    describe('Test getAllSubtasks', () => {
        it('Get all subtasks successfully', async () => {
            const subtasks = await subtaskData.getAllSubtasks(task._id);
            chai.expect(subtasks[0]).to.have.property('_id', subtask1._id);
            chai.expect(subtasks[0]).to.have.property('description', description1);
            chai.expect(subtasks[1]).to.have.property('_id', subtask2._id);
            chai.expect(subtasks[1]).to.have.property('description', description2);
        });
    });

    describe('Test createSubtask', () => {
        it('Create subtask successfully', async () => {
            const description = 'This is a new subtask created for testing purposes';
            const subtask = await subtaskData.createSubtask(task._id, description);
            chai.expect(subtask).to.have.property('_id');
            chai.expect(subtask).to.have.property('description', description);
        });
    });
    
    describe('Test editSubtask', () => {
        it('Edit subtask successfully', async () => {
            const description = 'This is a subtask created for testing purposes, now featuring a longer description';
            subtask1 = await subtaskData.editSubtask(task._id, subtask1._id, description);
            chai.expect(subtask1).to.have.property('description', description);
        });
    });
    
    describe('Test removeSubtask', () => {
        it('Remove subtask successfully', async () => {
            const id = subtask2._id;
            task = await subtaskData.removeSubtask(task._id, subtask2._id);
            chai.expect(task.subtasks.map(subtask => ({ _id: subtask._id }))).to.not.include({ _id: id });
        });
    });
    
    describe('Test toggleSubtask', () => {
        it('Toggle task successfully', async () => {
            subtask1 = await subtaskData.toggleSubtask(task._id, subtask1._id, true);
            chai.expect(subtask1).to.have.property('done', true);
        });
    });
    
    after('Close connection', async () => {
        // await dbConnection.closeConnection();
    });
});