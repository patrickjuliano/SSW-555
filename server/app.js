const express = require('express');
const session = require('express-session');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(session({
    name: 'AuthCookie',
    secret: 'SecretString',
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        secure: false
    },
    resave: false,
    saveUninitialized: true
}));

const cors = require('cors');
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

const configRoutes = require('./routes');
configRoutes(app);

const port = 4000
app.listen(port, async () => {
    console.log(`The server is up at http://localhost:${port}`);
});