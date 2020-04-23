const express = require('express');
const projectModel = require('../data/helpers/projectModel');

const router = express.Router();

router.get('/:id', validateProjectId(), (req, res) => {
    res.status(200).json(req.project);
})

router.get('/', (req, res, next) => {
    projectModel.get()
        .then(projects => {
            console.log(projects)
            res.status(200).json(projects)
        })
        .catch(err => {
            next(err)
        })
})

router.post('/', validateProjectData(), (req, res) => {
    projectModel.insert(req.body)
        .then(project => {
            console.log(project)

            res.status(201).json(project)
        })
        .catch(err => {
            next(err)
        })
})

router.delete('/:id', validateProjectId(), (req, res) => {
    projectModel.remove(req.params.id)
        .then(project => {
            res.status(200).json({
                message: 'Project has been removed'
            })
        })
        .catch(err => {
            next(err)
        })
})

router.put('/:id', validateProjectData(), validateProjectId(), (req, res) => {
    projectModel.update(req.params.id, req.body)
        .then(project => {
            res.status(200).json(project)
        })
        .catch(err => {
            next(err)
        })
})

function validateProjectId() {
    return (req, res, next) => {
        projectModel.get(req.params.id)
            .then(project => {
                if(project) {
                    console.log(project)
                    req.project = project

                    next()
                }else {
                    res.status(404).json({
                        message: 'Project not found'
                    })
                }
            })
    }
}

function validateProjectData() {
    return (req, res, next) => {
        if(!req.body.name || !req.body.description) {
            return res.status(400).json({
                message: 'Missing required information'
            })
        }
        next()
    }
}

module.exports = router;