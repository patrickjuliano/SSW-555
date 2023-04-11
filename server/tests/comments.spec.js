let chai = require('chai');
const dbConnection = require('../config/mongoConnection');
const data = require('../data');
const userData = data.users;
const projectData = data.projects;
const taskData = data.tasks;
const subtaskData = data.subtasks;
const commentData = data.comments;

describe('Test comment functionality', () => {
    let db;
    let user;
    let project;
    let task;
    let subtask;
    let comment1;
    const content1 = 'This is a project comment';
    let comment2;
    const content2 = 'This is a task comment';
    let comment3;
    const content3 = 'This is a subtask comment';

    before('Connect to database', async () => {
        db = await dbConnection.dbConnection();
        await db.dropDatabase();

        user = await userData.createUser('John', 'Doe', 'john.doe@gmail.com', 'jdoe123', 'jdoe123', 'Construction Manager');
        project = await projectData.createProject(user._id, 'Test Project');
        task = await taskData.createTask(project._id, 'Test Task', 'This is a task', new Date());
        subtask = await subtaskData.createSubtask(task._id, 'This is a subtask');
        comment1 = await commentData.createCommentInProject(project._id, user._id, content1);
        comment2 = await commentData.createCommentInTask(task._id, user._id, content2);
        comment3 = await commentData.createCommentInSubtask(task._id, subtask._id, user._id, content3);
    });

    describe('Test getting comment', () => {
        it('Get comment in project', async () => {
            const comment = await commentData.getCommentInProject(comment1._id);
            chai.expect(comment).to.have.property('_id', comment1._id);
            chai.expect(comment).to.have.property('content', content1);
        });

        it('Get comment in task', async () => {
            const comment = await commentData.getCommentInTask(task._id, comment2._id);
            chai.expect(comment).to.have.property('_id', comment2._id);
            chai.expect(comment).to.have.property('content', content2);
        });

        it('Get comment in subtask', async () => {
            const comment = await commentData.getCommentInSubtask(task._id, subtask._id, comment3._id);
            chai.expect(comment).to.have.property('_id', comment3._id);
            chai.expect(comment).to.have.property('content', content3);
        });
    });

    describe('Test getting all comments', () => {
        it('Get all comments in project', async () => {
            const comments = await commentData.getAllCommentsInProject(project._id);
            const comment = comments[0];
            chai.expect(comment).to.have.property('_id', comment1._id);
            chai.expect(comment).to.have.property('content', content1);
        });

        it('Get all comments in task', async () => {
            const comments = await commentData.getAllCommentsInTask(task._id);
            const comment = comments[0];
            chai.expect(comment).to.have.property('_id', comment2._id);
            chai.expect(comment).to.have.property('content', content2);
        });

        it('Get all comments in subtask', async () => {
            const comments = await commentData.getAllCommentsInSubtask(task._id, subtask._id);
            const comment = comments[0];
            chai.expect(comment).to.have.property('_id', comment3._id);
            chai.expect(comment).to.have.property('content', content3);
        });
    });

    describe('Test creating comment', () => {
        it('Create comment in project', async () => {
            const content = 'This is a new project comment';
            const comment = await commentData.createCommentInProject(project._id, user._id, content);
            chai.expect(comment).to.have.property('_id');
            chai.expect(comment).to.have.property('content', content);
        });

        it('Create comment in task', async () => {
            const content = 'This is a new task comment';
            const comment = await commentData.createCommentInTask(task._id, user._id, content);
            chai.expect(comment).to.have.property('_id');
            chai.expect(comment).to.have.property('content', content);
        });

        it('Create comment in subtask', async () => {
            const content = 'This is a new subtask comment';
            const comment = await commentData.createCommentInSubtask(task._id, subtask._id, user._id, content);
            chai.expect(comment).to.have.property('_id');
            chai.expect(comment).to.have.property('content', content);
        });
    });

    describe('Test editing comment', () => {
        it('Edit comment in project', async () => {
            const content = 'This is an edited project comment';
            const comment = await commentData.editCommentInProject(comment1._id, content);
            chai.expect(comment).to.have.property('content', content);
        });

        it('Edit comment in task', async () => {
            const content = 'This is an edited task comment';
            const comment = await commentData.editCommentInTask(task._id, comment2._id, content);
            chai.expect(comment).to.have.property('content', content);
        });

        it('Edit comment in subtask', async () => {
            const content = 'This is an edited subtask comment';
            const comment = await commentData.editCommentInSubtask(task._id, subtask._id, comment3._id, content);
            chai.expect(comment).to.have.property('content', content);
        });
    });

    describe('Test removing comment', () => {
        it('Remove comment in project', async () => {
            const id = comment1._id;
            project = await commentData.removeCommentInProject(comment1._id);
            chai.expect(project.comments.map(comment => ({ _id: comment._id }))).to.not.include({ _id: id });
        });

        it('Remove comment in task', async () => {
            const id = comment2._id;
            task = await commentData.removeCommentInTask(task._id, comment2._id);
            chai.expect(task.comments.map(comment => ({ _id: comment._id }))).to.not.include({ _id: id });
        });

        it('Remove comment in subtask', async () => {
            const id = comment3._id;
            subtask = await commentData.removeCommentInSubtask(task._id, subtask._id, comment3._id);
            chai.expect(subtask.comments.map(comment => ({ _id: comment._id }))).to.not.include({ _id: id });
        });
    });

    after('Close connection', async () => {
        // await dbConnection.closeConnection();
    });
});