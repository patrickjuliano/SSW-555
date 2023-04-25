let chai = require('chai');
const dbConnection = require('../config/mongoConnection');
const data = require('../data');
const userData = data.users;
const projectData = data.projects;
const taskData = data.tasks;
const subtaskData = data.subtasks;
const activityData = data.activity;

describe('Test activity functionality', () => {
    let db;
    let user;
    let project;
    let task;
    let subtask;
    let message1;
    const title1 = 'Test Project';
    const content1 = 'created a custom project message';
    let fullContent1;
    let message2;
    const title2 = 'Test Task';
    const content2 = 'created a custom task message';
    let fullContent2;
    let message3;
    const title3 = 'This is a subtask';
    const content3 = 'created a custom subtask message';
    let fullContent3;

    before('Connect to database', async () => {
        db = await dbConnection.dbConnection();
        await db.dropDatabase();

        user = await userData.createUser('John', 'Doe', 'john.doe@gmail.com', 'jdoe123', 'jdoe123', 'Construction Manager');
        project = await projectData.createProject(user._id, title1);
        task = await taskData.createTask(user._id, project._id, title2, 'This is a task', new Date());
        subtask = await subtaskData.createSubtask(task._id, title3);
        fullContent1 = `${content1} [${project.title}]`;
        fullContent2 = `${content2} [${project.title} > ${task.title}]`;
        fullContent3 = `${content3} [${project.title} > ${task.title} > ${subtask.description}]`;
        message1 = await activityData.createMessageFromProject(project._id, user._id, content1);
        message2 = await activityData.createMessageFromTask(task._id, user._id, content2, task.title);
        message3 = await activityData.createMessageFromSubtask(task._id, subtask._id, user._id, content3, `${task.title} > ${subtask.description}`);
    });

    describe('Test getting message', () => {
        it('Get project message', async () => {
            const message = await activityData.getMessage(message1._id);
            chai.expect(message).to.have.property('_id', message1._id);
            chai.expect(message).to.have.property('content', fullContent1);
            chai.expect(message).to.have.property('level', 0);
        });

        it('Get task message', async () => {
            const message = await activityData.getMessage(message2._id);
            chai.expect(message).to.have.property('_id', message2._id);
            chai.expect(message).to.have.property('content', fullContent2);
            chai.expect(message).to.have.property('level', 1);
        });

        it('Get subtask message', async () => {
            const message = await activityData.getMessage(message3._id);
            chai.expect(message).to.have.property('_id', message3._id);
            chai.expect(message).to.have.property('content', fullContent3);
            chai.expect(message).to.have.property('level', 2);
        });
    });

    describe('Test getting all messages', () => {
        it('Get all messages', async () => {
            const messages = await activityData.getAllMessages(project._id);
            chai.expect(messages[messages.length - 3]).to.have.property('_id', message1._id);
            chai.expect(messages[messages.length - 3]).to.have.property('content', fullContent1);
            chai.expect(messages[messages.length - 3]).to.have.property('level', 0);
            chai.expect(messages[messages.length - 2]).to.have.property('_id', message2._id);
            chai.expect(messages[messages.length - 2]).to.have.property('content', fullContent2);
            chai.expect(messages[messages.length - 2]).to.have.property('level', 1);
            chai.expect(messages[messages.length - 1]).to.have.property('_id', message3._id);
            chai.expect(messages[messages.length - 1]).to.have.property('content', fullContent3);
            chai.expect(messages[messages.length - 1]).to.have.property('level', 2);
        });
    });

    describe('Test creating message', () => {
        it('Create project message', async () => {
            const content = 'This is a new project message';
            const fullContent = `${content} [${project.title}]`;
            const message = await activityData.createMessageFromProject(project._id, user._id, content);
            chai.expect(message).to.have.property('_id');
            chai.expect(message).to.have.property('content', fullContent);
            chai.expect(message).to.have.property('level', 0);
        });

        it('Create task message', async () => {
            const content = 'This is a new task message';
            const fullContent = `${content} [${project.title} > ${task.title}]`;
            const message = await activityData.createMessageFromTask(task._id, user._id, content, task.title);
            chai.expect(message).to.have.property('_id');
            chai.expect(message).to.have.property('content', fullContent);
            chai.expect(message).to.have.property('level', 1);
        });

        it('Create subtask message', async () => {
            const content = 'This is a new subtask message';
            const fullContent = `${content} [${project.title} > ${task.title} > ${subtask.description}]`;
            const message = await activityData.createMessageFromSubtask(task._id, subtask._id, user._id, content, `${task.title} > ${subtask.description}`);
            chai.expect(message).to.have.property('_id');
            chai.expect(message).to.have.property('content', fullContent);
            chai.expect(message).to.have.property('level', 2);
        });
    });

    describe('Test editing message', () => {
        it('Edit project message', async () => {
            const content = 'This is an edited project message';
            const fullContent = `${content} [${project.title}]`;
            const message = await activityData.editMessage(message1._id, fullContent);
            chai.expect(message).to.have.property('content', fullContent);
        });

        it('Edit task message', async () => {
            const content = 'This is an edited task message';
            const fullContent = `${content} [${project.title} > ${task.title}]`;
            const message = await activityData.editMessage(message2._id, fullContent);
            chai.expect(message).to.have.property('content', fullContent);
        });

        it('Edit subtask message', async () => {
            const content = 'This is an edited subtask message';
            const fullContent = `${content} [${project.title} > ${task.title} > ${subtask.description}]`;
            const message = await activityData.editMessage(message3._id, fullContent);
            chai.expect(message).to.have.property('content', fullContent);
        });
    });

    describe('Test removing message', () => {
        it('Remove project message', async () => {
            const id = message1._id;
            const result = await activityData.removeMessage(id);
            chai.expect(result).to.have.property('success', true);
        });

        it('Remove task message', async () => {
            const id = message2._id;
            const result = await activityData.removeMessage(id);
            chai.expect(result).to.have.property('success', true);
        });

        it('Remove subtask message', async () => {
            const id = message3._id;
            const result = await activityData.removeMessage(id);
            chai.expect(result).to.have.property('success', true);
        });
    });

    after('Close connection', async () => {
        // await dbConnection.closeConnection();
    });
});