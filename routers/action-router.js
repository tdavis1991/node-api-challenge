const express = require('express');
const actionModel = require('../data/helpers/actionModel');

const router = express.Router();

router.get('/:id/actions', validateActionId(), (req, res) => {
    const id = req.params.id;
    res.status(200).json(req.action)
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
    }
}

module.exports = router;