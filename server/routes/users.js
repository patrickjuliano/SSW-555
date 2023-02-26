const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;
const validation = require('../validation');

router.get('/getUser', async (req, res) => {
    try {
        if (req.session.userId) {
            const user = await userData.getUser(req.session.userId);
            if (user._id) {
                res.status(200).json(user);
            } else {
                res.status(500).json({error: 'Internal server error'});
            }
        } else {
            res.status(200).json({});
        }
    } catch (e) {
        res.status(400).json({error: e});
    }
});

router.post('/logIn', async (req, res) => {
    try {
        req.query.email = validation.checkEmail(req.query.email);
        req.query.password = validation.checkPassword(req.query.password);
        
        const user = await userData.logIn(req.query.email, req.query.password);
        if (user._id) {
            req.session.userId = user._id;
            req.session.save()
            console.log(req.session.userId);
            res.status(200).json(user);
        } else {
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
    if (req.session.userId) {
        req.session.destroy();
        return res.status(200).json({success: 'You have successfully logged out'});
    } else {
        return res.status(401).json({error: 'You are not logged in'});
    }
});

module.exports = router;