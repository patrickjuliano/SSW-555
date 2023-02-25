const express = require('express');
const session = require('express-session');
const app = express();

const cors = require('cors');
app.use(cors());

app.use(session({
    name: 'AuthCookie',
    secret: 'SecretString',
    resave: false,
    saveUninitialized: true
}));

const configRoutes = require('./routes');
configRoutes(app);

const port = 4000
app.listen(port, async () => {
    console.log(`The server is up at http://localhost:${port}`);
});