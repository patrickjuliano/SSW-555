const projectRoutes = require('./projects');
const userRoutes = require('./users');

const constructorMethod = (app) => {
  app.use('/projects', projectRoutes);
  app.use('/users', userRoutes);

  app.use('*', (req, res) => {
    return res.status(404).json({ error: 'Not found' });
  });
};

module.exports = constructorMethod;