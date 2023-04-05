const commentRoutes = require('./comments');
const photoRoutes = require('./photos');
const projectRoutes = require('./projects');
const taskRoutes = require('./tasks');
const userRoutes = require('./users');

const constructorMethod = (app) => {
  app.use('/comments', commentRoutes);
  app.use('/photos', photoRoutes);
  app.use('/projects', projectRoutes);
  app.use('/tasks', taskRoutes);
  app.use('/users', userRoutes);

  app.use('*', (req, res) => {
    return res.status(404).json({ error: 'Not found' });
  });
};

module.exports = constructorMethod;