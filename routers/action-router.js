const express = require('express');
const actionModel = require('../data/helpers/actionModel');

const router = express.Router();

router.get('/', (req, res) => {
    actionModel.get()
        .then(actions => {
            res.status(200).json(actions)
        })
        .catch(err => {
            next(err)
        })
})

router.get('/:id', validateActionId(), (req, res) => {
    const id = req.params.id;

    actionModel.get(id)
        .then(action => {
            res.status(200).json(action)
        })
        .catch(err => {
            next(err)
        })
})

router.post('/', validateActionData(), (req, res) => {
    actionModel.insert(req.body)
      .then(action => {
          console.log(action);

          res.status(201).json(action)
      })  
      .catch(err => {
          next(err)
      })
})

router.put('/:id', validateActionData(), validateActionId(), (req, res) => {
    actionModel.update(req.params.id, req.body)
        .then(action => {
            res.status(200).json(action)
        })
        .catch(err => {
            next(err)
        })
})

router.delete('/:id', validateActionId(), (req, res) => {
    actionModel.remove(req.params.id)
        .then(action => {
            res.status(200).json({
                message: 'Action successfully removed'
            })
        })
        .catch(err => {
            next(err)
        })
})

function validateActionId() {
    return (req, res, next) => {
        actionModel.get(req.params.id)
            .then(action => {
                if(action) {
                    console.log(action)

                    req.action = action

                    next()
                }else {
                    res.status(404).json({
                        message: 'Action not found'
                    })
                }
            })
            .catch(err => {
                res.status(404).json({
                    message: 'Action not found'
                })
            })
    }
}

function validateActionData() {
    return (req, res, next) => {
        if(!req.body.project_id || !req.body.description || !req.body.notes) {
            return res.status(400).json({
                message: 'Missing required information'
            })
        }
        next()
    }
}

module.exports = router;