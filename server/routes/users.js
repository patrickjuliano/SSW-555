const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;
const validation = require('../validation');

router.get('/getUser', async (req, res) => {
    try {
        console.log(req.session.userId);
        if (req.session.userId) {
            console.log(111);
            const user = await userData.getUser(req.session.userId);
            console.log(222);
            if (user._id) {
                console.log(333);
                res.status(200).json(user);
            } else {
                console.log(444);
                res.status(500).json({error: 'Internal server error'});
            }
        } else {
            console.log(555);
            res.status(200).json({});
        }
    } catch (e) {
        console.log(666);
        res.status(400).json({error: e});
    }
});

router.post('/logIn', async (req, res) => {
    try {
        req.query.email = validation.checkEmail(req.query.email);
        req.query.password = validation.checkPassword(req.query.password);
        
        const user = await userData.logIn(req.query.email, req.query.password);
        if (user._id) {
            console.log('a');
            req.session.userId = user._id;
            req.session.save()
            console.log(req.session.userId);
            res.status(200).json(user);
        } else {
            console.log('b');
            res.status(500).json({error: 'Internal server error'});
        }
    } catch (e) {
        console.log(e);
        res.status(400).json({error: e});
    }
});

router.post('/signUp', async (req, res) => {
    try {
        req.query.firstName = validation.checkString(req.query.firstName);
        req.query.lastName = validation.checkString(req.query.lastName);
        req.query.email = validation.checkEmail(req.query.email);
        req.query.password = validation.checkPassword(req.query.password);
        req.query.confirmPassword = validation.comparePasswords(req.query.password, req.query.confirmPassword);
        req.query.role = validation.checkString(req.query.role);
        
        const user = await userData.createUser(req.query.firstName, req.query.lastName, req.query.email, req.query.password, req.query.confirmPassword, req.query.role);
        if (user._id) {
            req.session.userId = user._id;
            req.session.save();
            res.status(200).json(user);
        } else {
            res.status(500).json({error: 'Internal server error'});
        }
    } catch (e) {
        console.log(e);
        res.status(400).json({error: e});
    }
});

router.get('/logOut', async (req, res) => {
    console.log(req.session.userId);
    if (req.session.userId) req.session.destroy();
    return res.status(200).json({success: 'You have successfully logged out'});
});

module.exports = router;