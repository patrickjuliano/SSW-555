const bcrypt = require('bcrypt');
const saltRounds = 10;
const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const { ObjectId } = require('mongodb');
const validation = require('../validation');

async function getUser(id) {
    id = validation.checkId(id);

    const userCollection = await users();
    const user = await userCollection.findOne({_id: new ObjectId(id)});
    if (user === null) throw 'No user with that id';

    user._id = user._id.toString();
    return user;
}

async function getUserByEmail(email) {
    email = validation.checkEmail(email);

    const userCollection = await users();
    const user = await userCollection.findOne({email: email});

    if (user) user._id = user._id.toString();
    return user;
}

async function createUser(firstName, lastName, email, password, confirmPassword, role) {
    firstName = validation.checkString(firstName);
    lastName = validation.checkString(lastName);
    email = validation.checkEmail(email);
    password = validation.checkPassword(password);
    confirmPassword = validation.comparePasswords(password, confirmPassword);
    role = validation.checkString(role);
    
    const existingUser = await getUserByEmail(email);
    if (existingUser) throw 'Email is in use';

    const hash = await bcrypt.hash(password, saltRounds);
    const userCollection = await users();
    let newUser = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hash,
        role: role
    }

    const insertInfo = await userCollection.insertOne(newUser);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Could not add user';

    const user = await getUser(insertInfo.insertedId.toString());
    return {_id: user._id.toString(), name: user.name, email: user.email, role: user.role};
}

async function logIn(email, password) {
    email = validation.checkEmail(email);
    password = validation.checkPassword(password);

    const user = await getUserByEmail(email);
    if (!user) throw 'Either the email or password is invalid';
    
    const compare = await bcrypt.compare(password, user.password);
    if (!compare) throw 'Either the email or password is invalid';

    return {_id: user._id.toString(), name: user.name, email: user.email, role: user.role};
}

module.exports = {
    getUser,
    getUserByEmail,
    createUser,
    logIn
}