const express = require('express');
const router = express.Router();
const data = require('../data');
const photoData = data.photos;
const validation = require('../validation');

router.get('/:id', async (req, res) => {
    try {
        req.params.id = validation.checkId(req.params.id);
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const photo = await photoData.getPhoto(req.params.id);
        return res.status(200).json(photo);
    } catch (e) {
        return res.status(404).json({error: e});
    }
});

router.get('/projects/:id', async (req, res) => {
    try {
        req.params.id = validation.checkId(req.params.id);
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const photos = await photoData.getAllPhotos(req.params.id);
        return res.status(200).json({photos: photos});
    } catch (e) {
        return res.status(404).json({error: e});
    }
});

router.post('/', async (req, res) => {
    if (!req.session.userId) return res.status(401).json({error: 'You are not logged in'});
    try {
        req.query.projectId = validation.checkId(req.query.projectId);
        req.query.title = validation.checkString(req.query.title);
        req.query.required = validation.checkBoolean(req.query.required);
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const photo = await photoData.createPhoto(req.query.projectId, req.query.title, req.query.required);
        res.status(200).json(photo);
    } catch (e) {
        res.status(404).json({error: e});
    }
});

router.delete('/:id', async (req, res) => {
    if (!req.session.userId) return res.status(401).json({error: 'You are not logged in'});
    try {
        req.params.id = validation.checkId(req.params.id);
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const project = await photoData.removePhoto(req.params.id);
        res.status(200).json(project);
    } catch (e) {
        res.status(404).json({error: e});
    }
});

router.patch('/:id/upload', async (req, res) => {
    console.log("A");
    if (!req.session.userId) return res.status(401).json({error: 'You are not logged in'});
    console.log("B");
    try {
        req.params.id = validation.checkId(req.params.id);
        req.query.file = validation.checkFile(req.query.file);
    } catch (e) {
        console.log(e);
        return res.status(400).json({error: e});
    }
    console.log("C");
    try {
        const photo = await photoData.uploadPhoto(req.params.id, req.query.file);
        res.status(200).json(photo);
    } catch (e) {
        console.log(e);
        res.status(404).json({error: e});
    }
});

module.exports = router;